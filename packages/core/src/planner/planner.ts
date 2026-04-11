import type { Plan, PlannedTask, TaskAction, TaskRisk, TaskStatus } from '../scheduler/types.js';
import { ApprovalGate } from '../approval/approval.js';
import { EventBus } from '../events.js';

type TaskExecutor = (action: TaskAction) => Promise<string>;

/**
 * Planner — multi-step task execution with checkpoints.
 *
 * Named after Psychohistory: breaking complex goals into predictable steps.
 *
 * Features:
 * - Dependency resolution (tasks can depend on other tasks)
 * - Checkpoint/resume (pause and continue later)
 * - Approval gates for high-risk steps
 * - Parallel execution of independent steps
 * - Rollback-aware (tracks outputs for undo)
 */
export class Planner {
  private plans = new Map<string, Plan>();
  private executor: TaskExecutor;
  private approval: ApprovalGate;
  private events: EventBus;

  constructor(executor: TaskExecutor, approval?: ApprovalGate, events?: EventBus) {
    this.executor = executor;
    this.approval = approval ?? new ApprovalGate();
    this.events = events ?? new EventBus();
  }

  /** Create a new execution plan */
  create(name: string, description: string, tasks: Array<{
    name: string;
    description: string;
    action: TaskAction;
    risk?: TaskRisk;
    dependsOn?: string[];
  }>): Plan {
    const planId = `plan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const plannedTasks: PlannedTask[] = tasks.map((t, i) => ({
      id: `${planId}_task_${i}`,
      planId,
      step: i + 1,
      name: t.name,
      description: t.description,
      action: t.action,
      risk: t.risk ?? ApprovalGate.classifyRisk(t.action),
      status: 'pending' as TaskStatus,
      dependsOn: t.dependsOn ?? [],
      output: null,
      error: null,
      startedAt: null,
      completedAt: null,
    }));

    const plan: Plan = {
      id: planId,
      name,
      description,
      tasks: plannedTasks,
      status: 'pending',
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    this.plans.set(planId, plan);
    return plan;
  }

  /** Execute a plan step by step, respecting dependencies and approvals */
  async execute(planId: string): Promise<Plan> {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error(`Plan not found: ${planId}`);

    plan.status = 'running';
    await this.events.emit('plan:started', plan);

    while (this.hasRunnableTasks(plan)) {
      const runnable = this.getRunnableTasks(plan);

      // Execute independent tasks in parallel
      const results = await Promise.allSettled(
        runnable.map((task) => this.executeTask(plan, task)),
      );

      // Check for failures
      const failed = results.some((r) => r.status === 'rejected');
      if (failed) {
        plan.status = 'failed';
        await this.events.emit('plan:failed', plan);
        return plan;
      }
    }

    const allDone = plan.tasks.every((t) => t.status === 'completed');
    plan.status = allDone ? 'completed' : 'failed';
    plan.completedAt = new Date().toISOString();
    await this.events.emit(`plan:${plan.status}`, plan);
    return plan;
  }

  /** Resume a paused or failed plan from where it left off */
  async resume(planId: string): Promise<Plan> {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error(`Plan not found: ${planId}`);

    // Reset failed tasks to pending for retry
    for (const task of plan.tasks) {
      if (task.status === 'failed') {
        task.status = 'pending';
        task.error = null;
      }
    }

    return this.execute(planId);
  }

  /** Get a plan by ID */
  get(planId: string): Plan | undefined {
    return this.plans.get(planId);
  }

  /** List all plans */
  list(): Plan[] {
    return Array.from(this.plans.values());
  }

  /** Cancel a running plan */
  cancel(planId: string): void {
    const plan = this.plans.get(planId);
    if (!plan) return;
    plan.status = 'cancelled';
    for (const task of plan.tasks) {
      if (task.status === 'pending' || task.status === 'running') {
        task.status = 'cancelled';
      }
    }
  }

  private async executeTask(plan: Plan, task: PlannedTask): Promise<void> {
    // Check approval for high-risk tasks
    if (this.approval.needsApproval(task.risk)) {
      const approved = await this.approval.request(
        task.id,
        task.action,
        task.risk,
        `Step ${task.step}: ${task.description}`,
      );
      if (!approved) {
        task.status = 'cancelled';
        return;
      }
    }

    task.status = 'running';
    task.startedAt = new Date().toISOString();
    await this.events.emit('task:started', { plan, task });

    try {
      const output = await this.executor(task.action);
      task.output = output;
      task.status = 'completed';
      task.completedAt = new Date().toISOString();
      await this.events.emit('task:completed', { plan, task });
    } catch (error) {
      task.error = error instanceof Error ? error.message : String(error);
      task.status = 'failed';
      task.completedAt = new Date().toISOString();
      await this.events.emit('task:failed', { plan, task });
      throw error;
    }
  }

  /** Get tasks whose dependencies are all completed */
  private getRunnableTasks(plan: Plan): PlannedTask[] {
    return plan.tasks.filter((task) => {
      if (task.status !== 'pending') return false;
      return task.dependsOn.every((depId) => {
        const dep = plan.tasks.find((t) => t.id === depId);
        return dep?.status === 'completed';
      });
    });
  }

  /** Check if there are any tasks that can still run */
  private hasRunnableTasks(plan: Plan): boolean {
    return this.getRunnableTasks(plan).length > 0;
  }

  on(event: string, handler: (data: unknown) => void): () => void {
    return this.events.on(event, handler);
  }
}
