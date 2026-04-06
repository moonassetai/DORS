import { listPages, readPage } from './fs-utils.js';
import type { WikiPage, SearchResult } from './types.js';

export function searchWiki(query: string, wikiDir: string, wikiRoot: string, limit = 10): SearchResult[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const results: SearchResult[] = [];

  for (const pagePath of listPages(wikiDir)) {
    const page = readPage(pagePath, wikiRoot);
    const { score, matchedLines } = scorePage(page, terms);

    if (score > 0) {
      results.push({ page, score, matchedLines });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

function scorePage(page: WikiPage, terms: string[]): { score: number; matchedLines: string[] } {
  let score = 0;
  const matchedLines: string[] = [];
  const titleLower = page.frontmatter.title.toLowerCase();
  const contentLower = page.content.toLowerCase();

  for (const term of terms) {
    // Title match = 10 points
    if (titleLower.includes(term)) {
      score += 10;
    }

    // Tag match = 5 points
    if (page.frontmatter.tags?.some((t) => t.toLowerCase().includes(term))) {
      score += 5;
    }

    // Content match = 1 point per occurrence (max 5)
    const contentMatches = (contentLower.match(new RegExp(escapeRegex(term), 'g')) || []).length;
    score += Math.min(contentMatches, 5);
  }

  // Extract matched lines for context
  if (score > 0) {
    const lines = page.content.split('\n');
    for (const line of lines) {
      const lineLower = line.toLowerCase();
      if (terms.some((t) => lineLower.includes(t)) && line.trim()) {
        matchedLines.push(line.trim());
        if (matchedLines.length >= 3) break;
      }
    }
  }

  return { score, matchedLines };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
