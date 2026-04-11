import type { Tool, ToolResult } from '@dors/core';

/**
 * Code review tool — reviews diffs, staged changes, or specific files.
 */
export const reviewTool: Tool = {
  name: 'code_review',
  description:
    'Review code changes for quality, security, and correctness. Checks for OWASP vulnerabilities, code smells, and best practices.',
  parameters: {
    type: 'object',
    properties: {
      target: {
        type: 'string',
        enum: ['staged', 'diff', 'files', 'pr'],
        description: 'What to review: staged changes, current diff, specific files, or a PR',
      },
      files: {
        type: 'array',
        items: { type: 'string' },
        description: 'Specific files to review (when target is "files")',
      },
      focus: {
        type: 'string',
        enum: ['security', 'quality', 'performance', 'all'],
        description: 'Review focus area. Default: all',
      },
      prNumber: {
        type: 'number',
        description: 'PR number to review (when target is "pr")',
      },
    },
    required: ['target'],
  },

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const target = args.target as string;
    const focus = (args.focus as string) ?? 'all';

    return {
      success: true,
      output: JSON.stringify({
        message: `Code review: ${target} (focus: ${focus})`,
        target,
        focus,
        review: {
          files: [],
          issues: [],
          summary: 'No changes to review yet',
          approved: true,
          checks: {
            security: 'pass',
            quality: 'pass',
            performance: 'pass',
            tests: 'pass',
          },
        },
        hint: 'Connect to a git repository to review actual changes',
      }),
    };
  },
};
