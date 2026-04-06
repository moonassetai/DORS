import type { Tool, ToolResult } from '@dors/core';
import type { WikiConfig, WikiFrontmatter } from '../types.js';
import { ensureWikiStructure } from '../config.js';
import { writePage } from '../fs-utils.js';
import { join } from 'node:path';
import { appendFileSync } from 'node:fs';

export function createWikiWriteTool(config: WikiConfig): Tool {
  return {
    name: 'wiki_write',
    description: 'Create or update a wiki page with frontmatter and wikilinks',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Page path relative to wiki/ (e.g., "concepts/context-engineering.md")' },
        title: { type: 'string', description: 'Page title' },
        type: { type: 'string', enum: ['concept', 'entity', 'source-summary', 'comparison', 'implementation'], description: 'Page type' },
        content: { type: 'string', description: 'Markdown content body' },
        related: { type: 'array', items: { type: 'string' }, description: 'Related page titles as wikilinks' },
        confidence: { type: 'string', enum: ['high', 'medium', 'low'], description: 'Confidence level' },
        sources: { type: 'array', items: { type: 'string' }, description: 'Source file references' },
        tags: { type: 'array', items: { type: 'string' }, description: 'Tags for categorization' },
      },
      required: ['path', 'title', 'type', 'content'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      try {
        const root = ensureWikiStructure(config);
        const pagePath = args.path as string;
        const today = new Date().toISOString().split('T')[0];

        const frontmatter: WikiFrontmatter = {
          title: args.title as string,
          type: (args.type as WikiFrontmatter['type']) ?? 'concept',
          sources: (args.sources as string[]) ?? [],
          related: (args.related as string[]) ?? [],
          created: today,
          updated: today,
          confidence: (args.confidence as WikiFrontmatter['confidence']) ?? 'medium',
          ...(args.tags ? { tags: args.tags as string[] } : {}),
        };

        const fullPath = join(root, 'wiki', pagePath);
        writePage(fullPath, { path: pagePath, frontmatter, content: args.content as string });

        // Append to log
        const logEntry = `## [${today}] write | ${frontmatter.title}\nUpdated \`${pagePath}\` (type: ${frontmatter.type})\n\n`;
        appendFileSync(join(root, 'wiki', 'log.md'), logEntry, 'utf-8');

        return { success: true, output: `Wrote wiki page: ${pagePath} (${frontmatter.title})` };
      } catch (error) {
        return { success: false, output: '', error: error instanceof Error ? error.message : String(error) };
      }
    },
  };
}
