import type { Tool, ToolResult } from '@dors/core';
import type { FollowUp } from '../types.js';

const mockFollowUps: FollowUp[] = [
  {
    id: 'f1',
    contactId: 'c1',
    dealId: 'd1',
    type: 'email',
    dueDate: '2026-04-12',
    description: 'Send proposal revision to Hari',
    completed: false,
  },
  {
    id: 'f2',
    contactId: 'c2',
    type: 'call',
    dueDate: '2026-04-10',
    description: 'Follow up on research grant status',
    completed: false,
  },
  {
    id: 'f3',
    contactId: 'c1',
    dealId: 'd3',
    type: 'meeting',
    dueDate: '2026-04-15',
    description: 'License negotiation call',
    completed: false,
  },
];

export function createFollowUpTool(): Tool {
  return {
    name: 'crm_followup',
    description: 'Manage follow-up reminders: create, list, complete, or find overdue items',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['create', 'list', 'complete', 'overdue'],
          description: 'Action to perform',
        },
        followup: {
          type: 'object',
          description: 'Follow-up data (partial for complete, full for create)',
        },
      },
      required: ['action'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      try {
        const action = args.action as string;
        const followup = args.followup as Partial<FollowUp> | undefined;

        switch (action) {
          case 'list': {
            const pending = mockFollowUps.filter((f) => !f.completed);
            const output = pending
              .map((f) => `- [${f.type}] ${f.description} (due: ${f.dueDate})`)
              .join('\n');
            return { success: true, output: `${pending.length} pending follow-ups:\n${output}` };
          }

          case 'overdue': {
            const today = new Date().toISOString().split('T')[0];
            const overdue = mockFollowUps.filter((f) => !f.completed && f.dueDate < today);
            if (overdue.length === 0) return { success: true, output: 'No overdue follow-ups.' };
            const output = overdue
              .map((f) => `- [${f.type}] ${f.description} (was due: ${f.dueDate})`)
              .join('\n');
            return { success: true, output: `${overdue.length} overdue follow-ups:\n${output}` };
          }

          case 'create': {
            if (!followup?.contactId || !followup?.description) {
              return { success: false, output: '', error: 'contactId and description are required' };
            }
            return {
              success: true,
              output: `Follow-up created: [${followup.type ?? 'task'}] "${followup.description}" due ${followup.dueDate ?? 'TBD'}.`,
            };
          }

          case 'complete': {
            if (!followup?.id) return { success: false, output: '', error: 'Follow-up id is required to complete' };
            return { success: true, output: `Follow-up "${followup.id}" marked complete.` };
          }

          default:
            return { success: false, output: '', error: `Unknown action: ${action}` };
        }
      } catch (error) {
        return { success: false, output: '', error: error instanceof Error ? error.message : String(error) };
      }
    },
  };
}
