import { execSync } from 'node:child_process';
import type { Tool, ToolResult } from './types.js';

export const bashTool: Tool = {
  name: 'bash',
  description: 'Execute a shell command and return its output',
  parameters: {
    type: 'object',
    properties: {
      command: { type: 'string', description: 'Shell command to execute' },
      timeout: { type: 'number', description: 'Timeout in milliseconds (default: 30000)' },
    },
    required: ['command'],
  },
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const command = args.command as string;
      const timeout = (args.timeout as number) ?? 30000;

      const output = execSync(command, {
        timeout,
        encoding: 'utf-8',
        maxBuffer: 1024 * 1024,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      return { success: true, output: output.trim() };
    } catch (error) {
      const execError = error as { stderr?: string; stdout?: string; message: string };
      return {
        success: false,
        output: execError.stdout ?? '',
        error: execError.stderr ?? execError.message,
      };
    }
  },
};
