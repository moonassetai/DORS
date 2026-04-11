import type { Extension } from '@dors/ext';
import type { Tool } from '@dors/core';
import { createDocsGenerateTool } from './tools/generate.js';
import { createDocsTemplateTool } from './tools/template.js';
import { createDocsExportTool } from './tools/export.js';
import { createDocsReviewTool } from './tools/review.js';

export function createDocsExtension(): Extension {
  const tools: Tool[] = [
    createDocsGenerateTool(),
    createDocsTemplateTool(),
    createDocsExportTool(),
    createDocsReviewTool(),
  ];

  return {
    name: 'dors-ext-docs',
    version: '0.1.0',
    tools,
    async activate() {
      // Future: initialize template store, verify output directories
    },
    async deactivate() {
      // No cleanup needed
    },
  };
}

export default createDocsExtension;

export type {
  DocumentType,
  Document,
  DocumentTemplate,
  ExportFormat,
  ReviewFinding,
} from './types.js';
