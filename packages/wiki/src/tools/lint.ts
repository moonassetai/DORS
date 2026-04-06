import type { Tool, ToolResult } from '@dors/core';
import type { WikiConfig } from '../types.js';
import { ensureWikiStructure } from '../config.js';
import { listPages, readPage } from '../fs-utils.js';
import { extractWikilinks } from '../wikilinks.js';
import { join } from 'node:path';

export function createWikiLintTool(config: WikiConfig): Tool {
  return {
    name: 'wiki_lint',
    description: 'Health-check the wiki: find orphan pages, stale content, missing backlinks, and broken wikilinks',
    parameters: {
      type: 'object',
      properties: {},
    },
    async execute(): Promise<ToolResult> {
      try {
        const root = ensureWikiStructure(config);
        const wikiDir = join(root, 'wiki');
        const pages = listPages(wikiDir);

        const issues: string[] = [];
        const allTitles = new Set<string>();
        const allLinkedTitles = new Set<string>();
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Pass 1: Collect all titles and links
        for (const pagePath of pages) {
          const page = readPage(pagePath, root);
          allTitles.add(page.frontmatter.title.toLowerCase());

          const links = extractWikilinks(page.content);
          for (const link of links) {
            allLinkedTitles.add(link.toLowerCase());
          }
        }

        // Pass 2: Check each page
        for (const pagePath of pages) {
          const page = readPage(pagePath, root);
          const title = page.frontmatter.title;

          // Stale check (>30 days since update)
          const updated = new Date(page.frontmatter.updated);
          if (updated < thirtyDaysAgo) {
            const daysSince = Math.floor((today.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
            issues.push(`STALE: "${title}" (${page.path}) — last updated ${daysSince} days ago`);
          }

          // No sources check
          if (page.frontmatter.sources.length === 0 && page.frontmatter.type !== 'comparison') {
            issues.push(`NO_SOURCES: "${title}" (${page.path}) — has no source references`);
          }

          // Empty content check
          if (page.content.trim().length < 50) {
            issues.push(`EMPTY: "${title}" (${page.path}) — content is very short (${page.content.trim().length} chars)`);
          }

          // Broken wikilinks
          const links = extractWikilinks(page.content);
          for (const link of links) {
            if (!allTitles.has(link.toLowerCase())) {
              issues.push(`BROKEN_LINK: "${title}" links to [[${link}]] which does not exist`);
            }
          }
        }

        // Orphan check: pages not linked from anywhere
        for (const pagePath of pages) {
          const page = readPage(pagePath, root);
          const titleLower = page.frontmatter.title.toLowerCase();
          if (!allLinkedTitles.has(titleLower)) {
            issues.push(`ORPHAN: "${page.frontmatter.title}" (${page.path}) — not linked from any other page`);
          }
        }

        if (issues.length === 0) {
          return { success: true, output: `Wiki health check passed. ${pages.length} pages, no issues found.` };
        }

        const output = [
          `Wiki health check: ${issues.length} issue(s) found across ${pages.length} pages.`,
          '',
          ...issues.map((i) => `- ${i}`),
        ].join('\n');

        return { success: true, output };
      } catch (error) {
        return { success: false, output: '', error: error instanceof Error ? error.message : String(error) };
      }
    },
  };
}
