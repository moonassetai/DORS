import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { Tool, ToolResult } from './types.js';

export const writeTool: Tool = {
  name: 'write',
  description: 'Write content to a file at the given path, creating directories as needed',
  parameters: {
    type: 'object',
    properties: {
      path: { type: 'string', description: 'File path to write to' },
      content: { type: 'string', description: 'Content to write' },
    },
    required: ['path', 'content'],
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const path = args.path as string;
      const content = args.content as string;
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content, 'utf-8');
      return { success: true, output: `Wrote ${content.length} bytes to ${path}` };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
};
