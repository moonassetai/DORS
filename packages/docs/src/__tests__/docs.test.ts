import { describe, test, expect } from 'vitest';
import { createDocsExtension } from '../index.js';
import { createDocsGenerateTool } from '../tools/generate.js';
import { createDocsTemplateTool } from '../tools/template.js';
import { createDocsExportTool } from '../tools/export.js';
import { createDocsReviewTool } from '../tools/review.js';

describe('dors-ext-docs', () => {
  describe('createDocsExtension', () => {
    test('returns an extension with correct name and version', () => {
      const ext = createDocsExtension();
      expect(ext.name).toBe('dors-ext-docs');
      expect(ext.version).toBe('0.1.0');
    });

    test('registers all 4 tools', () => {
      const ext = createDocsExtension();
      expect(ext.tools).toHaveLength(4);
      const names = ext.tools!.map((t) => t.name);
      expect(names).toContain('docs_generate');
      expect(names).toContain('docs_template');
      expect(names).toContain('docs_export');
      expect(names).toContain('docs_review');
    });

    test('activate and deactivate resolve without error', async () => {
      const ext = createDocsExtension();
      await expect(ext.activate()).resolves.toBeUndefined();
      await expect(ext.deactivate()).resolves.toBeUndefined();
    });
  });

  describe('docs_generate', () => {
    const tool = createDocsGenerateTool();

    test('generates a document with correct fields', async () => {
      const result = await tool.execute({
        type: 'proposal',
        title: 'Test Proposal',
        variables: { client_name: 'Acme Corp' },
      });

      expect(result.success).toBe(true);
      const doc = JSON.parse(result.output);
      expect(doc.type).toBe('proposal');
      expect(doc.title).toBe('Test Proposal');
      expect(doc.variables.client_name).toBe('Acme Corp');
      expect(doc.version).toBe(1);
      expect(doc.id).toMatch(/^doc_/);
    });

    test('includes createdAt and updatedAt timestamps', async () => {
      const result = await tool.execute({
        type: 'contract',
        title: 'Service Agreement',
        variables: {},
      });

      const doc = JSON.parse(result.output);
      expect(doc.createdAt).toBeTruthy();
      expect(doc.updatedAt).toBeTruthy();
    });
  });

  describe('docs_template', () => {
    const tool = createDocsTemplateTool();

    test('list returns empty array', async () => {
      const result = await tool.execute({ action: 'list' });
      expect(result.success).toBe(true);
      expect(JSON.parse(result.output)).toEqual([]);
    });

    test('get requires template id', async () => {
      const result = await tool.execute({ action: 'get', template: {} });
      expect(result.success).toBe(false);
      expect(result.error).toContain('id is required');
    });

    test('create returns a new template', async () => {
      const result = await tool.execute({
        action: 'create',
        template: {
          name: 'Standard Proposal',
          type: 'proposal',
          content: 'Dear {{client_name}},\n\nWe propose...',
          requiredVars: ['client_name'],
        },
      });

      expect(result.success).toBe(true);
      const tpl = JSON.parse(result.output);
      expect(tpl.id).toMatch(/^tpl_/);
      expect(tpl.name).toBe('Standard Proposal');
      expect(tpl.requiredVars).toContain('client_name');
    });

    test('create requires name, type, and content', async () => {
      const result = await tool.execute({
        action: 'create',
        template: { name: 'Incomplete' },
      });
      expect(result.success).toBe(false);
    });

    test('update requires template id', async () => {
      const result = await tool.execute({ action: 'update', template: {} });
      expect(result.success).toBe(false);
      expect(result.error).toContain('id is required');
    });
  });

  describe('docs_export', () => {
    const tool = createDocsExportTool();

    test('returns export metadata for each format', async () => {
      for (const format of ['pdf', 'docx', 'md', 'html'] as const) {
        const result = await tool.execute({ documentId: 'doc_test', format });
        expect(result.success).toBe(true);
        const data = JSON.parse(result.output);
        expect(data.format).toBe(format);
        expect(data.outputPath).toContain(`doc_test.${format}`);
      }
    });
  });

  describe('docs_review', () => {
    const tool = createDocsReviewTool();

    test('returns findings for "all" focus', async () => {
      const result = await tool.execute({ documentId: 'doc_test', focus: 'all' });
      expect(result.success).toBe(true);
      const data = JSON.parse(result.output);
      expect(data.findings).toHaveLength(3);
      const categories = data.findings.map((f: { category: string }) => f.category);
      expect(categories).toContain('completeness');
      expect(categories).toContain('tone');
      expect(categories).toContain('legal');
    });

    test('returns only targeted findings for specific focus', async () => {
      const result = await tool.execute({ documentId: 'doc_test', focus: 'legal' });
      expect(result.success).toBe(true);
      const data = JSON.parse(result.output);
      expect(data.findings).toHaveLength(1);
      expect(data.findings[0].category).toBe('legal');
    });
  });
});
