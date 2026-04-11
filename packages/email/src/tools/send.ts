import type { Tool, ToolResult } from '@dors/core';

export const sendTool: Tool = {
  name: 'email_send',
  description:
    'Send or schedule an email. Requires approval (Three Laws: external action)',
  parameters: {
    type: 'object',
    properties: {
      draftId: { type: 'string', description: 'ID of the draft to send' },
      scheduledFor: {
        type: 'string',
        description: 'ISO-8601 datetime to schedule send (omit for immediate)',
      },
    },
    required: ['draftId'],
  },

  async execute(
    args: Record<string, unknown>,
  ): Promise<ToolResult> {
    const draftId = args.draftId as string;
    const scheduledFor = args.scheduledFor as string | undefined;

    // Stub: this action requires approval gate before actual send
    const action = scheduledFor
      ? `Scheduled draft ${draftId} for ${scheduledFor}`
      : `Queued draft ${draftId} for immediate send`;

    return {
      success: true,
      output: JSON.stringify({
        draftId,
        scheduledFor: scheduledFor ?? null,
        status: 'pending_approval',
        note: 'Three Laws: external action requires human approval before send',
        action,
      }),
    };
  },
};
