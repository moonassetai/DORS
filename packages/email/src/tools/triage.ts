import type { Tool, ToolResult } from '@dors/core';
import type { EmailFilter, TriageResult } from '../types.js';

export const triageTool: Tool = {
  name: 'email_triage',
  description:
    'Triage inbox emails by priority, categorize as urgent/actionable/FYI/archive',
  parameters: {
    type: 'object',
    properties: {
      account: { type: 'string', description: 'Email account identifier' },
      limit: {
        type: 'number',
        description: 'Max emails to triage (default 20)',
        default: 20,
      },
      filter: {
        type: 'object',
        description: 'Optional filter rules for auto-triage',
      },
    },
    required: ['account'],
  },

  async execute(
    args: Record<string, unknown>,
  ): Promise<ToolResult> {
    const account = args.account as string;
    const limit = (args.limit as number) ?? 20;
    const _filter = args.filter as EmailFilter | undefined;

    // Stub: return mock triage results
    const results: TriageResult[] = Array.from({ length: Math.min(limit, 3) }, (_, i) => ({
      messageId: `msg-${i + 1}`,
      category: (['urgent', 'actionable', 'fyi'] as const)[i % 3],
      suggestedAction: ['Reply immediately', 'Schedule follow-up', 'Archive'][i % 3],
      reason: `Mock triage result ${i + 1} for account ${account}`,
    }));

    return {
      success: true,
      output: JSON.stringify({ account, triaged: results.length, results }),
    };
  },
};
