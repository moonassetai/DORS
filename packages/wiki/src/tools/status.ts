import type { Tool, ToolResult } from '@dors/core';
import type { WikiConfig } from '../types.js';
import { ensureWikiStructure } from '../config.js';
import { listPages, readPage } from '../fs-utils.js';
import { extractWikilinks } from '../wikilinks.js';
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export function createWikiStatusTool(config: WikiConfig): Tool {
  return {
    name: 'wiki_status',
    description: 'Show wiki statistics: page count by type, source count, wikilink count, last activity',
    parameters: {
      type: 'object',
      properties: {},
    },
    async execute(): Promise<ToolResult> {
      try {
        const root = ensureWikiStructure(config);
        const wikiDir = join(root, 'wiki');
        const pages = listPages(wikiDir);

        const typeCounts: Record<string, number> = {};
        let totalLinks = 0;
        let latestUpdate = '';

        for (const pagePath of pages) {
          const page = readPage(pagePath, root);
          const type = page.frontmatter.type || 'unknown';
          typeCounts[type] = (typeCounts[type] || 0) + 1;
          totalLinks += extractWikilinks(page.content).length;
          if (page.frontmatter.updated > latestUpdate) {
            latestUpdate = page.frontmatter.updated;
          }
        }

        // Count raw sources
        let rawCount = 0;
        const rawDir = join(root, 'raw');
        if (existsSync(rawDir)) {
          function countFiles(dir: string): number {
            let count = 0;
            if (!existsSync(dir)) return 0;
            for (const entry of readdirSync(dir, { withFileTypes: true })) {
              if (entry.isDirectory()) count += countFiles(join(dir, entry.name));
              else count++;
            }
            return count;
          }
          rawCount = countFiles(rawDir);
        }

        // Get log entry count
        let logEntries = 0;
        const logPath = join(root, 'wiki', 'log.md');
        if (existsSync(logPath)) {
          const logContent = readFileSync(logPath, 'utf-8');
          logEntries = (logContent.match(/^## \[/gm) || []).length;
        }

        const typeList = Object.entries(typeCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([type, count]) => `  ${type}: ${count}`)
          .join('\n');

        const output = [
          `DORS Wiki Status`,
          `================`,
          ``,
          `Wiki pages: ${pages.length}`,
          `Raw sources: ${rawCount}`,
          `Total wikilinks: ${totalLinks}`,
          `Log entries: ${logEntries}`,
          `Last updated: ${latestUpdate || 'never'}`,
          ``,
          `Pages by type:`,
          typeList || '  (none)',
          ``,
          `Wiki path: ${root}`,
        ].join('\n');

        return { success: true, output };
      } catch (error) {
        return { success: false, output: '', error: error instanceof Error ? error.message : String(error) };
      }
    },
  };
}
