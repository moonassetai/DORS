/**
 * Capability checker — gates DORS agent actions based on user level.
 * Three Laws governance applied at every gate.
 */

export interface Capability {
  name: string;
  description: string;
  requiredLevel: number;
  approvalPrompt: string;
}

export type CapabilityLevel =
  | 'chat'
  | 'read_files'
  | 'draft'
  | 'shell'
  | 'send'
  | 'finance'
  | 'fleet';

const CAPABILITY_MAP: Record<CapabilityLevel, Capability> = {
  chat: {
    name: 'Basic Chat',
    description: 'Read-only answers, no tool execution',
    requiredLevel: 1,
    approvalPrompt: '',
  },
  read_files: {
    name: 'Read Local Files',
    description: 'Access local filesystem (read-only)',
    requiredLevel: 5,
    approvalPrompt: 'DORS wants to read {path}. Allow? [y/n]',
  },
  draft: {
    name: 'Draft Documents',
    description: 'Create emails, documents (never auto-sent)',
    requiredLevel: 10,
    approvalPrompt: 'DORS drafted {type} to {recipient}. Review? [y/n/edit]',
  },
  shell: {
    name: 'Execute Commands',
    description: 'Run shell commands with explicit approval',
    requiredLevel: 15,
    approvalPrompt: 'DORS wants to run: `{cmd}`. This could modify files. Allow? [y/n]',
  },
  send: {
    name: 'Send Messages',
    description: 'Send emails, post to social (with approval)',
    requiredLevel: 20,
    approvalPrompt: 'DORS will send this to {recipient}. Confirm? [y/n]',
  },
  finance: {
    name: 'Financial Actions',
    description: 'Invoices, expenses, payments (critical approval)',
    requiredLevel: 30,
    approvalPrompt: 'DORS will create {action} for ${amount}. CRITICAL. Type CONFIRM:',
  },
  fleet: {
    name: 'Fleet Coordination',
    description: 'Orchestrate multiple agents',
    requiredLevel: 50,
    approvalPrompt: 'Coordinate {count} agents for {task}. Review plan? [y/plan/n]',
  },
};

export class CapabilityChecker {
  constructor(private userLevel: number) {}

  /** Check if user level permits this capability */
  canUse(capability: CapabilityLevel): boolean {
    return this.userLevel >= CAPABILITY_MAP[capability].requiredLevel;
  }

  /** Get the approval prompt for a capability (with variable substitution) */
  getPrompt(capability: CapabilityLevel, vars: Record<string, string> = {}): string {
    let prompt = CAPABILITY_MAP[capability].approvalPrompt;
    for (const [key, value] of Object.entries(vars)) {
      prompt = prompt.replace(`{${key}}`, value);
    }
    return prompt;
  }

  /** Get next unlock info */
  nextUnlock(): Capability | null {
    const sorted = Object.values(CAPABILITY_MAP)
      .filter(c => c.requiredLevel > this.userLevel)
      .sort((a, b) => a.requiredLevel - b.requiredLevel);
    return sorted[0] ?? null;
  }

  /** List all capabilities with their unlock status */
  listAll(): Array<Capability & { unlocked: boolean }> {
    return Object.values(CAPABILITY_MAP).map(cap => ({
      ...cap,
      unlocked: this.userLevel >= cap.requiredLevel,
    }));
  }
}
