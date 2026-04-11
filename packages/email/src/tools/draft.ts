import type { Tool, ToolResult } from '@dors/core';
import type { EmailDraft } from '../types.js';

export const draftTool: Tool = {
  name: 'email_draft',
  description: 'Draft an email with subject, body, and recipients',
  parameters: {
    type: 'object',
    properties: {
      to: {
        type: 'array',
        items: { type: 'string' },
        description: 'Recipient email addresses',
      },
      subject: { type: 'string', description: 'Email subject line' },
      body: { type: 'string', description: 'Email body (plain text or HTML)' },
      cc: {
        type: 'array',
        items: { type: 'string' },
        description: 'CC recipients',
      },
      replyTo: {
        type: 'string',
        description: 'Message ID this is replying to',
      },
    },
    required: ['to', 'subject', 'body'],
  },

  async execute(
    args: Record<string, unknown>,
  ): Promise<ToolResult> {
    const draft: EmailDraft = {
      id: `draft-${Date.now()}`,
      to: args.to as string[],
      subject: args.subject as string,
      body: args.body as string,
      cc: args.cc as string[] | undefined,
      replyTo: args.replyTo as string | undefined,
    };

    return {
      success: true,
      output: JSON.stringify({ draft }),
    };
  },
};
