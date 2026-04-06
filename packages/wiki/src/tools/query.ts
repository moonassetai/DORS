import type { Tool, ToolResult } from '@dors/core';
import type { WikiConfig } from '../types.js';
import { ensureWikiStructure } from '../config.js';
import { searchWiki } from '../search.js';
import { join } from 'node:path';

export function createWikiQueryTool(config: WikiConfig): Tool {
  return {
    name: 'wiki_query',
    description: 'Search wiki pages by keyword and return relevant content with excerpts',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query (keywords)' },
        limit: { type: 'number', description: 'Max results (default 5)' },
      },
      required: ['query'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      try {
        const root = ensureWikiStructure(config);
        const wikiDir = join(root, 'wiki');
        const query = args.query as string;
        const limit = (args.limit as number) ?? 5;

        const results = searchWiki(query, wikiDir, root, limit);

        if (results.length === 0) {
          return { success: true, output: `No wiki pages found for "${query}".` };
        }

        const output = results.map((r, i) => {
          const excerpts = r.matchedLines.map((l) => `  > ${l}`).join('\n');
          return `${i + 1}. **${r.page.frontmatter.title}** (${r.page.path}, score: ${r.score})\n   Type: ${r.page.frontmatter.type} | Confidence: ${r.page.frontmatter.confidence}\n${excerpts}`;
        }).join('\n\n');

        return { success: true, output: `Found ${results.length} pages for "${query}":\n\n${output}` };
      } catch (error) {
        return { success: false, output: '', error: error instanceof Error ? error.message : String(error) };
      }
    },
  };
}
