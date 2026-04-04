import { readFileSync, writeFileSync } from 'node:fs';
import type { Tool, ToolResult } from './types.js';

export const editTool: Tool = {
  name: 'edit',
  description: 'Edit a file by replacing an exact string match with new content',
  parameters: {
    type: 'object',
    properties: {
      path: { type: 'string', description: 'File path to edit' },
      old_string: { type: 'string', description: 'Exact string to find and replace' },
      new_string: { type: 'string', description: 'Replacement string' },
    },
    required: ['path', 'old_string', 'new_string'],
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const path = args.path as string;
      const oldString = args.old_string as string;
      const newString = args.new_string as string;

      const content = readFileSync(path, 'utf-8');

      if (!content.includes(oldString)) {
        return { success: false, output: '', error: 'old_string not found in file' };
      }

      const updated = content.replace(oldString, newString);
      writeFileSync(path, updated, 'utf-8');

      return { success: true, output: `Edited ${path}` };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
};
