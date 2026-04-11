import type { Tool, ToolResult } from '@dors/core';
import type { SearchResult } from '../types.js';

export function createSearchTool(): Tool {
  return {
    name: 'web_search',
    description: 'Search the web and return ranked results',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        limit: { type: 'number', description: 'Max results to return (default 10)' },
      },
      required: ['query'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      try {
        const query = args.query as string;
        const limit = (args.limit as number) ?? 10;

        // Stub: return mock search results
        const results: SearchResult[] = Array.from({ length: Math.min(limit, 3) }, (_, i) => ({
          url: `https://example.com/result-${i + 1}`,
          title: `${query} - Result ${i + 1}`,
          snippet: `[stub] This is a mock search result for "${query}" (${i + 1} of ${limit})`,
          score: 1 - i * 0.1,
        }));

        return {
          success: true,
          output: JSON.stringify(results, null, 2),
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
