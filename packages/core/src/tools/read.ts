import { readFileSync } from 'node:fs';
import type { Tool, ToolResult } from './types.js';

export const readTool: Tool = {
  name: 'read',
  description: 'Read the contents of a file at the given path',
  parameters: {
    type: 'object',
    properties: {
      path: { type: 'string', description: 'Absolute or relative file path' },
    },
    required: ['path'],
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const path = args.path as string;
      const content = readFileSync(path, 'utf-8');
      return { success: true, output: content };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
};
