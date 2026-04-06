import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { parseFrontmatter, serializeFrontmatter, readPage, writePage, listPages } from '../fs-utils.js';

describe('parseFrontmatter', () => {
  it('should parse valid frontmatter', () => {
    const raw = `---
title: "Test Page"
type: concept
sources: ["raw/test.md"]
related: ["[[Other]]"]
created: 2026-04-06
updated: 2026-04-06
confidence: high
tags: ["ai", "test"]
---

# Content here`;

    const { frontmatter, content } = parseFrontmatter(raw);
    expect(frontmatter.title).toBe('Test Page');
    expect(frontmatter.type).toBe('concept');
    expect(frontmatter.sources).toEqual(['raw/test.md']);
    expect(frontmatter.related).toEqual(['[[Other]]']);
    expect(frontmatter.confidence).toBe('high');
    expect(frontmatter.tags).toEqual(['ai', 'test']);
    expect(content).toBe('# Content here');
  });

  it('should handle missing frontmatter', () => {
    const raw = '# Just content';
    const { frontmatter, content } = parseFrontmatter(raw);
    expect(frontmatter.title).toBe('');
    expect(frontmatter.type).toBe('concept');
    expect(content).toBe('# Just content');
  });

  it('should handle empty arrays', () => {
    const raw = `---
title: "Empty"
type: entity
sources: []
related: []
created: 2026-04-06
updated: 2026-04-06
confidence: low
---

Body`;

    const { frontmatter } = parseFrontmatter(raw);
    expect(frontmatter.sources).toEqual([]);
    expect(frontmatter.related).toEqual([]);
  });
});

describe('serializeFrontmatter', () => {
  it('should produce valid frontmatter string', () => {
    const fm = {
      title: 'Test',
      type: 'concept' as const,
      sources: ['a.md'],
      related: ['[[B]]'],
      created: '2026-04-06',
      updated: '2026-04-06',
      confidence: 'high' as const,
    };
    const result = serializeFrontmatter(fm);
    expect(result).toContain('---');
    expect(result).toContain('title: "Test"');
    expect(result).toContain('type: concept');
    expect(result).toContain('"a.md"');
  });
});

describe('readPage / writePage', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'dors-wiki-test-'));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should round-trip a wiki page', () => {
    const page = {
      path: 'concepts/test.md',
      frontmatter: {
        title: 'Round Trip',
        type: 'concept' as const,
        sources: [],
        related: [],
        created: '2026-04-06',
        updated: '2026-04-06',
        confidence: 'medium' as const,
      },
      content: 'This is the content.',
    };

    const filePath = join(tmpDir, 'wiki', 'concepts', 'test.md');
    writePage(filePath, page);

    const read = readPage(filePath, tmpDir);
    expect(read.frontmatter.title).toBe('Round Trip');
    expect(read.content).toBe('This is the content.');
  });
});

describe('listPages', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'dors-wiki-list-'));
    const conceptsDir = join(tmpDir, 'concepts');
    mkdirSync(conceptsDir, { recursive: true });
    writeFileSync(join(tmpDir, 'index.md'), '# Index');
    writeFileSync(join(tmpDir, 'log.md'), '# Log');
    writeFileSync(join(conceptsDir, 'a.md'), '---\ntitle: "A"\ntype: concept\nsources: []\nrelated: []\ncreated: 2026-04-06\nupdated: 2026-04-06\nconfidence: medium\n---\n\nA content');
    writeFileSync(join(conceptsDir, 'b.md'), '---\ntitle: "B"\ntype: concept\nsources: []\nrelated: []\ncreated: 2026-04-06\nupdated: 2026-04-06\nconfidence: medium\n---\n\nB content');
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should list md files excluding index and log', () => {
    const pages = listPages(tmpDir);
    expect(pages).toHaveLength(2);
    expect(pages.some((p) => p.includes('a.md'))).toBe(true);
    expect(pages.some((p) => p.includes('b.md'))).toBe(true);
    expect(pages.some((p) => p.includes('index.md'))).toBe(false);
  });
});
