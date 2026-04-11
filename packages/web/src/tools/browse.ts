import type { Tool, ToolResult } from '@dors/core';
import type { WebPage } from '../types.js';

export function createBrowseTool(): Tool {
  return {
    name: 'web_browse',
    description: 'Fetch and extract content from a URL (text, links, images, or all)',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'URL to fetch and extract content from' },
        extract: {
          type: 'string',
          enum: ['text', 'links', 'images', 'all'],
          description: 'What to extract from the page',
        },
      },
      required: ['url', 'extract'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      try {
        const url = args.url as string;
        const extract = (args.extract as string) ?? 'text';

        // Stub: return mock page content
        const page: WebPage = {
          url,
          title: `Page at ${url}`,
          content: `[stub] Extracted ${extract} content from ${url}`,
          fetchedAt: new Date().toISOString(),
        };

        return {
          success: true,
          output: JSON.stringify(page, null, 2),
        };
      } catch (error) {
        return {
          success: false,
          output: '',
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },
  };
}
