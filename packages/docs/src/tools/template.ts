import type { Tool, ToolResult } from '@dors/core';
import type { DocumentTemplate } from '../types.js';

type TemplateAction = 'list' | 'get' | 'create' | 'update';

export function createDocsTemplateTool(): Tool {
  return {
    name: 'docs_template',
    description: 'Manage document templates: list, get, create, or update',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['list', 'get', 'create', 'update'],
          description: 'Template management action',
        },
        template: {
          type: 'object',
          description: 'Template data (required for create/update, id required for get/update)',
        },
      },
      required: ['action'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      try {
        const action = args.action as TemplateAction;
        const template = args.template as Partial<DocumentTemplate> | undefined;

        // Stub: in production this would interact with a template store
        switch (action) {
          case 'list':
            return { success: true, output: JSON.stringify([], null, 2) };

          case 'get': {
            if (!template?.id) {
              return { success: false, output: '', error: 'Template id is required for get' };
            }
            return { success: true, output: JSON.stringify({ id: template.id, found: false }, null, 2) };
          }

          case 'create': {
            if (!template?.name || !template?.type || !template?.content) {
              return { success: false, output: '', error: 'name, type, and content are required to create a template' };
            }
            const created: DocumentTemplate = {
              id: `tpl_${Date.now().toString(36)}`,
              type: template.type,
              name: template.name,
              content: template.content,
              requiredVars: template.requiredVars ?? [],
            };
            return { success: true, output: JSON.stringify(created, null, 2) };
          }

          case 'update': {
            if (!template?.id) {
              return { success: false, output: '', error: 'Template id is required for update' };
            }
            return { success: true, output: JSON.stringify({ id: template.id, updated: true }, null, 2) };
          }

          default:
            return { success: false, output: '', error: `Unknown action: ${action}` };
        }
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
