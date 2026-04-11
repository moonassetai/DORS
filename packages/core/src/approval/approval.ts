import type { ApprovalRequest, TaskAction, TaskRisk } from '../scheduler/types.js';
import { EventBus } from '../events.js';

type ApprovalDecision = 'approved' | 'denied';

/**
 * Approval Gate — human-in-the-loop for high-risk actions.
 *
 * Three Laws compliance: DORS auto-executes low-risk actions (code, file edits)
 * but pauses for human approval on anything that:
 * - Spends money (payments, subscriptions, API calls with cost)
 * - Contacts external parties (email, social media, messaging)
 * - Modifies shared state (database migrations, deployments)
 * - Accesses sensitive data (credentials, financial records)
 *
 * This is the Zeroth Law in practice: protect the human from unintended consequences.
 */
export class ApprovalGate {
  private pending = new Map<string, ApprovalRequest>();
  private resolvers = new Map<string, (decision: ApprovalDecision) => void>();
  private events: EventBus;
  private autoApproveRisks: Set<TaskRisk>;

  constructor(events?: EventBus, autoApprove: TaskRisk[] = ['low']) {
    this.events = events ?? new EventBus();
    this.autoApproveRisks = new Set(autoApprove);
  }

  /** Request approval for an action. Returns true if approved. */
  async request(
    taskId: string,
    action: TaskAction,
    risk: TaskRisk,
    reason: string,
  ): Promise<boolean> {
    // Auto-approve low-risk actions
    if (this.autoApproveRisks.has(risk)) return true;

    const request: ApprovalRequest = {
      id: `approval_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      taskId,
      action,
      risk,
      reason,
      status: 'pending',
      decidedAt: null,
      decidedBy: null,
    };

    this.pending.set(request.id, request);
    await this.events.emit('approval:requested', request);

    // Wait for human decision
    const decision = await new Promise<ApprovalDecision>((resolve) => {
      this.resolvers.set(request.id, resolve);
    });

    request.status = decision;
    request.decidedAt = new Date().toISOString();
    request.decidedBy = 'user';
    this.pending.delete(request.id);
    this.resolvers.delete(request.id);

    await this.events.emit(`approval:${decision}`, request);

    return decision === 'approved';
  }

  /** Approve a pending request */
  approve(requestId: string): void {
    const resolver = this.resolvers.get(requestId);
    if (resolver) resolver('approved');
  }

  /** Deny a pending request */
  deny(requestId: string): void {
    const resolver = this.resolvers.get(requestId);
    if (resolver) resolver('denied');
  }

  /** Get all pending approval requests */
  getPending(): ApprovalRequest[] {
    return Array.from(this.pending.values());
  }

  /** Check if an action needs approval based on risk */
  needsApproval(risk: TaskRisk): boolean {
    return !this.autoApproveRisks.has(risk);
  }

  /** Classify a tool action's risk level */
  static classifyRisk(action: TaskAction): TaskRisk {
    if (action.type === 'tool') {
      // Core tools are low risk
      if (['read'].includes(action.tool)) return 'low';
      if (['write', 'edit'].includes(action.tool)) return 'medium';
      if (['bash'].includes(action.tool)) return 'medium';
    }

    if (action.type === 'extension') {
      // Financial actions are critical
      if (action.extension.includes('finance')) return 'critical';
      // External communication is high
      if (['email', 'social', 'crm'].some((e) => action.extension.includes(e))) return 'high';
      // Everything else is medium
      return 'medium';
    }

    if (action.type === 'prompt') return 'low';

    return 'medium';
  }

  on(event: string, handler: (data: unknown) => void): () => void {
    return this.events.on(event, handler);
  }
}
