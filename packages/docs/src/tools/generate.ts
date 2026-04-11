import type { Tool, ToolResult } from '@dors/core';
import type { Document, DocumentType } from '../types.js';

export function createDocsGenerateTool(): Tool {
  return {
    name: 'docs_generate',
    description: 'Generate a document from a template and variable substitutions',
    parameters: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['proposal', 'contract', 'sow', 'invoice_letter', 'nda', 'report', 'memo'],
          description: 'Document type to generate',
        },
        title: {
          type: 'string',
          description: 'Document title',
        },
        variables: {
          type: 'object',
          description: 'Key-value pairs to substitute into the template (e.g., {"client_name": "Acme Corp"})',
        },
        templateId: {
          type: 'string',
          description: 'Optional template ID to use; defaults to the standard template for the given type',
        },
      },
      required: ['type', 'title', 'variables'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      try {
        const docType = args.type as DocumentType;
        const title = args.title as string;
        const variables = (args.variables as Record<string, string>) ?? {};
        const templateId = args.templateId as string | undefined;

        const now = new Date().toISOString();
        const id = `doc_${Date.now().toString(36)}`;

        // Stub: in production this would load the template, substitute variables,
        // and potentially call an LLM for dynamic sections.
        const document: Document = {
          id,
          type: docType,
          title,
          content: `[Generated ${docType}: ${title}]`,
          variables,
          createdAt: now,
          updatedAt: now,
          version: 1,
        };

        return {
          success: true,
          output: JSON.stringify(document, null, 2),
        };
      } catch (error) {
        return {
          success: false,
          output: '',
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },
  };
}
