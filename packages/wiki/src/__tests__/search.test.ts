import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { searchWiki } from '../search.js';

describe('searchWiki', () => {
  let tmpDir: string;
  let wikiDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'dors-search-'));
    wikiDir = join(tmpDir, 'wiki');
    mkdirSync(join(wikiDir, 'concepts'), { recursive: true });
    mkdirSync(join(wikiDir, 'entities'), { recursive: true });

    writeFileSync(join(wikiDir, 'concepts', 'context-engineering.md'),
      '---\ntitle: "Context Engineering"\ntype: concept\nsources: []\nrelated: []\ncreated: 2026-04-06\nupdated: 2026-04-06\nconfidence: high\ntags: ["ai", "llm"]\n---\n\nContext engineering is about managing what goes into the LLM context window.');

    writeFileSync(join(wikiDir, 'concepts', 'three-laws.md'),
      '---\ntitle: "Three Laws"\ntype: concept\nsources: []\nrelated: []\ncreated: 2026-04-06\nupdated: 2026-04-06\nconfidence: high\n---\n\nAsimov\'s Three Laws of Robotics govern all DORS behavior.');

    writeFileSync(join(wikiDir, 'entities', 'asimov.md'),
      '---\ntitle: "Isaac Asimov"\ntype: entity\nsources: []\nrelated: ["[[Three Laws]]"]\ncreated: 2026-04-06\nupdated: 2026-04-06\nconfidence: high\n---\n\nIsaac Asimov wrote the Foundation series and the Robot series.');
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should find pages matching query', () => {
    const results = searchWiki('context engineering', wikiDir, tmpDir);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].page.frontmatter.title).toBe('Context Engineering');
  });

  it('should rank title matches higher', () => {
    const results = searchWiki('asimov', wikiDir, tmpDir);
    expect(results[0].page.frontmatter.title).toBe('Isaac Asimov');
  });

  it('should return empty for no match', () => {
    const results = searchWiki('quantum computing', wikiDir, tmpDir);
    expect(results).toHaveLength(0);
  });

  it('should respect limit', () => {
    const results = searchWiki('the', wikiDir, tmpDir, 1);
    expect(results.length).toBeLessThanOrEqual(1);
  });

  it('should include matched lines', () => {
    const results = searchWiki('context window', wikiDir, tmpDir);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].matchedLines.length).toBeGreaterThan(0);
  });
});
