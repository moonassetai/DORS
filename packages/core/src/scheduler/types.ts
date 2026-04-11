/** Risk level determines whether approval is required */
export type TaskRisk = 'low' | 'medium' | 'high' | 'critical';

/** Task status lifecycle */
export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'awaiting_approval';

/** A scheduled recurring task */
export interface ScheduledTask {
  id: string;
  name: string;
  description: string;
  /** Cron expression (e.g., "0 * * * *" for hourly) */
  cron: string;
  /** The action to execute — either a tool call or a prompt */
  action: TaskAction;
  /** Risk level — high/critical requires approval before execution */
  risk: TaskRisk;
  enabled: boolean;
  lastRun: string | null;
  nextRun: string | null;
  createdAt: string;
}

/** One-off or planned task in a multi-step plan */
export interface PlannedTask {
  id: string;
  planId: string;
  step: number;
  name: string;
  description: string;
  action: TaskAction;
  risk: TaskRisk;
  status: TaskStatus;
  dependsOn: string[];
  output: string | null;
  error: string | null;
  startedAt: string | null;
  completedAt: string | null;
}

/** What a task actually does */
export type TaskAction =
  | { type: 'tool'; tool: string; args: Record<string, unknown> }
  | { type: 'prompt'; prompt: string }
  | { type: 'extension'; extension: string; method: string; args: Record<string, unknown> };

/** A multi-step execution plan */
export interface Plan {
  id: string;
  name: string;
  description: string;
  tasks: PlannedTask[];
  status: TaskStatus;
  createdAt: string;
  completedAt: string | null;
}

/** Approval request for high-risk actions */
export interface ApprovalRequest {
  id: string;
  taskId: string;
  action: TaskAction;
  risk: TaskRisk;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  decidedAt: string | null;
  decidedBy: string | null;
}
