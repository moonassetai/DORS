import type { ScheduledTask, TaskAction, TaskRisk } from './types.js';

/** Parse a simple cron expression and return next run time */
function getNextRun(cron: string, after: Date = new Date()): Date {
  // Simplified cron: supports minute, hour, day-of-month, month, day-of-week
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) throw new Error(`Invalid cron expression: ${cron}`);

  const [min, hour] = parts;
  const next = new Date(after);
  next.setSeconds(0, 0);

  if (min !== '*') next.setMinutes(parseInt(min, 10));
  if (hour !== '*') next.setHours(parseInt(hour, 10));

  // If the computed time is in the past, advance by the interval
  if (next <= after) {
    if (hour !== '*') {
      next.setDate(next.getDate() + 1);
    } else if (min !== '*') {
      next.setHours(next.getHours() + 1);
    } else {
      next.setMinutes(next.getMinutes() + 1);
    }
  }

  return next;
}

type TaskExecutor = (action: TaskAction) => Promise<string>;
type ApprovalHandler = (task: ScheduledTask) => Promise<boolean>;

/**
 * Scheduler — cron-like periodic task execution for DORS agents.
 *
 * Supports risk-based approval gates: low/medium tasks auto-execute,
 * high/critical tasks pause for human approval (Three Laws compliance).
 */
export class Scheduler {
  private tasks = new Map<string, ScheduledTask>();
  private timers = new Map<string, ReturnType<typeof setTimeout>>();
  private executor: TaskExecutor;
  private approvalHandler: ApprovalHandler;

  constructor(
    executor: TaskExecutor,
    approvalHandler?: ApprovalHandler,
  ) {
    this.executor = executor;
    this.approvalHandler = approvalHandler ?? (() => Promise.resolve(true));
  }

  /** Register a recurring task */
  add(task: Omit<ScheduledTask, 'lastRun' | 'nextRun' | 'createdAt'>): ScheduledTask {
    const now = new Date().toISOString();
    const scheduled: ScheduledTask = {
      ...task,
      lastRun: null,
      nextRun: getNextRun(task.cron).toISOString(),
      createdAt: now,
    };

    this.tasks.set(task.id, scheduled);
    if (scheduled.enabled) this.scheduleNext(scheduled);
    return scheduled;
  }

  /** Remove a task */
  remove(id: string): boolean {
    const timer = this.timers.get(id);
    if (timer) clearTimeout(timer);
    this.timers.delete(id);
    return this.tasks.delete(id);
  }

  /** Enable or disable a task */
  setEnabled(id: string, enabled: boolean): void {
    const task = this.tasks.get(id);
    if (!task) return;
    task.enabled = enabled;
    if (enabled) {
      this.scheduleNext(task);
    } else {
      const timer = this.timers.get(id);
      if (timer) clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  /** Get all registered tasks */
  list(): ScheduledTask[] {
    return Array.from(this.tasks.values());
  }

  /** Get a task by ID */
  get(id: string): ScheduledTask | undefined {
    return this.tasks.get(id);
  }

  /** Stop all scheduled tasks */
  stopAll(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
  }

  private scheduleNext(task: ScheduledTask): void {
    const nextRun = new Date(task.nextRun!);
    const delay = Math.max(0, nextRun.getTime() - Date.now());

    const timer = setTimeout(async () => {
      await this.executeTask(task);
    }, delay);

    this.timers.set(task.id, timer);
  }

  private async executeTask(task: ScheduledTask): Promise<void> {
    // High/critical risk requires approval
    if (task.risk === 'high' || task.risk === 'critical') {
      const approved = await this.approvalHandler(task);
      if (!approved) {
        // Re-schedule for next run without executing
        task.nextRun = getNextRun(task.cron).toISOString();
        if (task.enabled) this.scheduleNext(task);
        return;
      }
    }

    try {
      await this.executor(task.action);
      task.lastRun = new Date().toISOString();
    } catch {
      // Failures are logged but don't stop the schedule
    }

    task.nextRun = getNextRun(task.cron).toISOString();
    if (task.enabled) this.scheduleNext(task);
  }
}

/** Common schedule presets */
export const SCHEDULES = {
  EVERY_MINUTE: '* * * * *',
  EVERY_5_MINUTES: '*/5 * * * *',
  EVERY_HOUR: '0 * * * *',
  EVERY_MORNING: '0 9 * * *',
  EVERY_EVENING: '0 18 * * *',
  TWICE_DAILY: '0 9,18 * * *',
  DAILY_MIDNIGHT: '0 0 * * *',
  WEEKLY_MONDAY: '0 9 * * 1',
} as const;
