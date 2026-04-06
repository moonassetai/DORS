import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { WikiConfig } from '../types.js';
import { createWikiWriteTool } from '../tools/write.js';
import { createWikiQueryTool } from '../tools/query.js';
import { createWikiStatusTool } from '../tools/status.js';
import { createWikiLintTool } from '../tools/lint.js';
import { createWikiIngestTool } from '../tools/ingest.js';

describe('wiki tools', () => {
  let tmpDir: string;
  let config: WikiConfig;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'dors-tools-'));
    config = { wikiPath: tmpDir };
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  describe('wiki_write', () => {
    it('should create a wiki page', async () => {
      const tool = createWikiWriteTool(config);
      const result = await tool.execute({
        path: 'concepts/test.md',
        title: 'Test Concept',
        type: 'concept',
        content: 'This is a test concept page.',
      });

      expect(result.success).toBe(true);
      expect(result.output).toContain('Test Concept');

      const filePath = join(tmpDir, 'wiki', 'concepts', 'test.md');
      expect(existsSync(filePath)).toBe(true);

      const content = readFileSync(filePath, 'utf-8');
      expect(content).toContain('title: "Test Concept"');
      expect(content).toContain('This is a test concept page.');
    });

    it('should append to log', async () => {
      const tool = createWikiWriteTool(config);
      await tool.execute({
        path: 'concepts/logged.md',
        title: 'Logged Page',
        type: 'concept',
        content: 'Content.',
      });

      const logPath = join(tmpDir, 'wiki', 'log.md');
      const log = readFileSync(logPath, 'utf-8');
      expect(log).toContain('Logged Page');
    });
  });

  describe('wiki_query', () => {
    it('should find pages by keyword', async () => {
      // First create some pages
      const writeTool = createWikiWriteTool(config);
      await writeTool.execute({
        path: 'concepts/foundation.md',
        title: 'Foundation Series',
        type: 'concept',
        content: 'The Foundation series by Isaac Asimov explores psychohistory.',
      });

      const queryTool = createWikiQueryTool(config);
      const result = await queryTool.execute({ query: 'foundation asimov' });

      expect(result.success).toBe(true);
      expect(result.output).toContain('Foundation Series');
    });

    it('should return no results message for unknown query', async () => {
      const tool = createWikiQueryTool(config);
      const result = await tool.execute({ query: 'nonexistent topic xyz' });
      expect(result.success).toBe(true);
      expect(result.output).toContain('No wiki pages found');
    });
  });

  describe('wiki_status', () => {
    it('should report wiki statistics', async () => {
      const writeTool = createWikiWriteTool(config);
      await writeTool.execute({
        path: 'concepts/a.md',
        title: 'Page A',
        type: 'concept',
        content: 'Content A with [[Page B]] link.',
      });
      await writeTool.execute({
        path: 'entities/b.md',
        title: 'Page B',
        type: 'entity',
        content: 'Content B.',
      });

      const tool = createWikiStatusTool(config);
      const result = await tool.execute({});

      expect(result.success).toBe(true);
      expect(result.output).toContain('Wiki pages: 2');
      expect(result.output).toContain('concept: 1');
      expect(result.output).toContain('entity: 1');
    });
  });

  describe('wiki_lint', () => {
    it('should detect broken wikilinks', async () => {
      const writeTool = createWikiWriteTool(config);
      await writeTool.execute({
        path: 'concepts/linker.md',
        title: 'Linker',
        type: 'concept',
        content: 'See [[Nonexistent Page]] for details.',
      });

      const tool = createWikiLintTool(config);
      const result = await tool.execute({});

      expect(result.success).toBe(true);
      expect(result.output).toContain('BROKEN_LINK');
      expect(result.output).toContain('Nonexistent Page');
    });
  });

  describe('wiki_ingest', () => {
    it('should read a raw source file', async () => {
      // Create a raw source
      mkdirSync(join(tmpDir, 'raw', 'articles'), { recursive: true });
      writeFileSync(join(tmpDir, 'raw', 'articles', 'test-article.md'), '# Test Article\n\nThis is about context engineering and LLMs.');

      const tool = createWikiIngestTool(config);
      const result = await tool.execute({ source: 'articles/test-article.md' });

      expect(result.success).toBe(true);
      expect(result.output).toContain('test-article');
      expect(result.output).toContain('SOURCE CONTENT');
    });

    it('should fail for nonexistent source', async () => {
      const tool = createWikiIngestTool(config);
      const result = await tool.execute({ source: 'nonexistent.md' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });
});
