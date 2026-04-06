import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, relative, extname } from 'node:path';
import type { WikiFrontmatter, WikiPage } from './types.js';

export function parseFrontmatter(raw: string): { frontmatter: WikiFrontmatter; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    return {
      frontmatter: {
        title: '',
        type: 'concept',
        sources: [],
        related: [],
        created: new Date().toISOString().split('T')[0],
        updated: new Date().toISOString().split('T')[0],
        confidence: 'medium',
      },
      content: raw,
    };
  }

  const yamlBlock = match[1];
  const content = match[2].trim();
  const fm: Record<string, unknown> = {};

  for (const line of yamlBlock.split('\n')) {
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (!kvMatch) continue;
    const [, key, rawValue] = kvMatch;
    const value = rawValue.trim();

    // Handle arrays: ["a", "b"] or [a, b]
    if (value.startsWith('[') && value.endsWith(']')) {
      const inner = value.slice(1, -1);
      if (!inner.trim()) {
        fm[key] = [];
      } else {
        fm[key] = inner.split(',').map((s) => s.trim().replace(/^["']|["']$/g, ''));
      }
    } else {
      fm[key] = value.replace(/^["']|["']$/g, '');
    }
  }

  return {
    frontmatter: {
      title: (fm.title as string) ?? '',
      type: (fm.type as WikiFrontmatter['type']) ?? 'concept',
      sources: (fm.sources as string[]) ?? [],
      related: (fm.related as string[]) ?? [],
      created: (fm.created as string) ?? new Date().toISOString().split('T')[0],
      updated: (fm.updated as string) ?? new Date().toISOString().split('T')[0],
      confidence: (fm.confidence as WikiFrontmatter['confidence']) ?? 'medium',
      ...(fm.tags ? { tags: fm.tags as string[] } : {}),
    },
    content,
  };
}

export function serializeFrontmatter(fm: WikiFrontmatter): string {
  const lines = [
    '---',
    `title: "${fm.title}"`,
    `type: ${fm.type}`,
    `sources: [${fm.sources.map((s) => `"${s}"`).join(', ')}]`,
    `related: [${fm.related.map((r) => `"${r}"`).join(', ')}]`,
    `created: ${fm.created}`,
    `updated: ${fm.updated}`,
    `confidence: ${fm.confidence}`,
  ];

  if (fm.tags?.length) {
    lines.push(`tags: [${fm.tags.map((t) => `"${t}"`).join(', ')}]`);
  }

  lines.push('---');
  return lines.join('\n');
}

export function readPage(filePath: string, wikiRoot: string): WikiPage {
  const raw = readFileSync(filePath, 'utf-8');
  const { frontmatter, content } = parseFrontmatter(raw);
  return {
    path: relative(join(wikiRoot, 'wiki'), filePath),
    frontmatter,
    content,
  };
}

export function writePage(filePath: string, page: WikiPage): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const header = serializeFrontmatter(page.frontmatter);
  writeFileSync(filePath, `${header}\n\n${page.content}\n`, 'utf-8');
}

export function listPages(wikiDir: string): string[] {
  const pages: string[] = [];

  function walk(dir: string): void {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (extname(entry) === '.md' && entry !== 'index.md' && entry !== 'log.md') {
        pages.push(full);
      }
    }
  }

  walk(wikiDir);
  return pages;
}
