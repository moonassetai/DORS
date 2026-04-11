import { describe, it, expect } from 'vitest';
import { createWebExtension } from '../index.js';
import { createBrowseTool } from '../tools/browse.js';
import { createSearchTool } from '../tools/search.js';
import { createResearchTool } from '../tools/research.js';
import { createMonitorTool } from '../tools/monitor.js';

describe('dors-ext-web', () => {
  describe('createWebExtension', () => {
    it('should create an extension with correct metadata', () => {
      const ext = createWebExtension();
      expect(ext.name).toBe('dors-ext-web');
      expect(ext.version).toBe('0.1.0');
    });

    it('should expose 4 tools', () => {
      const ext = createWebExtension();
      expect(ext.tools).toHaveLength(4);
      const names = ext.tools!.map(t => t.name);
      expect(names).toContain('web_browse');
      expect(names).toContain('web_search');
      expect(names).toContain('web_research');
      expect(names).toContain('web_monitor');
    });

    it('should activate and deactivate without error', async () => {
      const ext = createWebExtension();
      await expect(ext.activate()).resolves.toBeUndefined();
      await expect(ext.deactivate()).resolves.toBeUndefined();
    });
  });

  describe('web_browse', () => {
    it('should return page content for a URL', async () => {
      const tool = createBrowseTool();
      const result = await tool.execute({ url: 'https://example.com', extract: 'text' });
      expect(result.success).toBe(true);

      const page = JSON.parse(result.output);
      expect(page.url).toBe('https://example.com');
      expect(page.title).toContain('example.com');
      expect(page.content).toContain('text');
      expect(page.fetchedAt).toBeDefined();
    });

    it('should support all extract modes', async () => {
      const tool = createBrowseTool();
      for (const mode of ['text', 'links', 'images', 'all']) {
        const result = await tool.execute({ url: 'https://example.com', extract: mode });
        expect(result.success).toBe(true);
        expect(result.output).toContain(mode);
      }
    });
  });

  describe('web_search', () => {
    it('should return search results', async () => {
      const tool = createSearchTool();
      const result = await tool.execute({ query: 'AGI frameworks' });
      expect(result.success).toBe(true);

      const results = JSON.parse(result.output);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty('url');
      expect(results[0]).toHaveProperty('title');
      expect(results[0]).toHaveProperty('snippet');
      expect(results[0]).toHaveProperty('score');
    });

    it('should respect the limit parameter', async () => {
      const tool = createSearchTool();
      const result = await tool.execute({ query: 'test', limit: 2 });
      const results = JSON.parse(result.output);
      expect(results.length).toBeLessThanOrEqual(2);
    });
  });

  describe('web_research', () => {
    it('should return a research report', async () => {
      const tool = createResearchTool();
      const result = await tool.execute({ topic: 'AI safety' });
      expect(result.success).toBe(true);

      const report = JSON.parse(result.output);
      expect(report.query).toBe('AI safety');
      expect(report.sources.length).toBeGreaterThan(0);
      expect(report.summary).toBeDefined();
      expect(report.keyFindings.length).toBeGreaterThan(0);
      expect(report.recommendations.length).toBeGreaterThan(0);
    });

    it('should return more sources for thorough depth', async () => {
      const tool = createResearchTool();
      const quick = JSON.parse((await tool.execute({ topic: 'test', depth: 'quick' })).output);
      const thorough = JSON.parse((await tool.execute({ topic: 'test', depth: 'thorough' })).output);
      expect(thorough.sources.length).toBeGreaterThan(quick.sources.length);
    });
  });

  describe('web_monitor', () => {
    it('should add a competitor', async () => {
      const tool = createMonitorTool();
      const result = await tool.execute({ action: 'add', url: 'https://rival.ai', name: 'RivalAI' });
      expect(result.success).toBe(true);
      expect(result.output).toContain('RivalAI');
    });

    it('should require url and name for add', async () => {
      const tool = createMonitorTool();
      const result = await tool.execute({ action: 'add', url: 'https://rival.ai' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should list tracked competitors', async () => {
      const tool = createMonitorTool();
      await tool.execute({ action: 'add', url: 'https://listed.ai', name: 'Listed' });
      const result = await tool.execute({ action: 'list' });
      expect(result.success).toBe(true);

      const list = JSON.parse(result.output);
      expect(list.some((c: { name: string }) => c.name === 'Listed')).toBe(true);
    });

    it('should check a tracked competitor', async () => {
      const tool = createMonitorTool();
      await tool.execute({ action: 'add', url: 'https://check.ai', name: 'CheckAI' });
      const result = await tool.execute({ action: 'check', url: 'https://check.ai' });
      expect(result.success).toBe(true);
    });

    it('should fail to check an untracked competitor', async () => {
      const tool = createMonitorTool();
      const result = await tool.execute({ action: 'check', url: 'https://unknown.ai' });
      expect(result.success).toBe(false);
    });

    it('should generate a report', async () => {
      const tool = createMonitorTool();
      const result = await tool.execute({ action: 'report' });
      expect(result.success).toBe(true);

      const report = JSON.parse(result.output);
      expect(report).toHaveProperty('totalCompetitors');
      expect(report).toHaveProperty('summary');
    });
  });
});
