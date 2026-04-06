import type { Tool, ToolResult } from '@dors/core';
import type { WikiConfig } from '../types.js';
import { ensureWikiStructure } from '../config.js';
import { readFileSync, existsSync, appendFileSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
// import { listPages, readPage } from '../fs-utils.js';
import { searchWiki } from '../search.js';

export function createWikiIngestTool(config: WikiConfig): Tool {
  return {
    name: 'wiki_ingest',
    description: 'Read a raw source file and prepare it for wiki integration. Returns source content and suggests related pages to update.',
    parameters: {
      type: 'object',
      properties: {
        source: { type: 'string', description: 'Path to raw source file (absolute or relative to wiki raw/)' },
      },
      required: ['source'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      try {
        const root = ensureWikiStructure(config);
        const sourcePath = args.source as string;

        // Resolve source path
        let fullPath = sourcePath;
        if (!existsSync(fullPath)) {
          fullPath = join(root, 'raw', sourcePath);
        }
        if (!existsSync(fullPath)) {
          return { success: false, output: '', error: `Source not found: ${sourcePath}` };
        }

        const content = readFileSync(fullPath, 'utf-8');
        const fileName = basename(fullPath, extname(fullPath));
        const today = new Date().toISOString().split('T')[0];

        // Find related wiki pages by searching for keywords from the filename
        const wikiDir = join(root, 'wiki');
        const keywords = fileName.replace(/[-_]/g, ' ');
        const relatedPages = searchWiki(keywords, wikiDir, root, 5);

        const relatedList = relatedPages.length > 0
          ? relatedPages.map((r) => `  - [[${r.page.frontmatter.title}]] (${r.page.path})`).join('\n')
          : '  (none found)';

        // Log the ingest
        const logEntry = `## [${today}] ingest | ${fileName}\nIngested \`${sourcePath}\` (${content.length} chars)\n\n`;
        appendFileSync(join(root, 'wiki', 'log.md'), logEntry, 'utf-8');

        const output = [
          `Source: ${sourcePath}`,
          `Size: ${content.length} characters, ${content.split('\n').length} lines`,
          ``,
          `Suggested summary path: sources/${fileName}.md`,
          ``,
          `Related wiki pages to update:`,
          relatedList,
          ``,
          `--- SOURCE CONTENT ---`,
          content.length > 4000 ? content.slice(0, 4000) + '\n\n[... truncated, use read tool for full content]' : content,
        ].join('\n');

        return { success: true, output };
      } catch (error) {
        return { success: false, output: '', error: error instanceof Error ? error.message : String(error) };
      }
    },
  };
}
