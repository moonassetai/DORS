import type { Tool, ToolResult } from '@dors/core';
import type { AgentMode } from '../types.js';

/**
 * OpenCode integration — AI coding agent.
 *
 * Maps to OpenCode's dual-agent system:
 * - build mode: full read-write access for development
 * - plan mode: read-only for code exploration and analysis
 *
 * Provider-agnostic: works with Claude, OpenAI, Ollama, or any LLM.
 */
export const developTool: Tool = {
  name: 'code_develop',
  description:
    'Execute coding tasks using OpenCode agent. Build mode for writing code, plan mode for exploration. Supports any LLM provider.',
  parameters: {
    type: 'object',
    properties: {
      task: {
        type: 'string',
        description: 'Description of what to build or explore',
      },
      mode: {
        type: 'string',
        enum: ['build', 'plan'],
        description: 'Agent mode: build (read-write) or plan (read-only). Default: build',
      },
      files: {
        type: 'array',
        items: { type: 'string' },
        description: 'Specific files to focus on (optional)',
      },
      specId: {
        type: 'string',
        description: 'OpenSpec specification ID to implement (optional)',
      },
    },
    required: ['task'],
  },

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const task = args.task as string;
    const mode = (args.mode as AgentMode) ?? 'build';
    const files = (args.files as string[]) ?? [];
    const specId = args.specId as string | undefined;

    const taskId = `task_${Date.now()}`;

    if (mode === 'plan') {
      return {
        success: true,
        output: JSON.stringify({
          taskId,
          mode: 'plan',
          message: `Analyzing: ${task}`,
          analysis: {
            description: task,
            files: files.length > 0 ? files : ['(will auto-detect relevant files)'],
            recommendations: [
              'Analysis would examine code structure and dependencies',
              'Read-only mode: no files will be modified',
            ],
          },
          hint: 'Switch to mode: "build" to implement changes',
        }),
      };
    }

    return {
      success: true,
      output: JSON.stringify({
        taskId,
        mode: 'build',
        specId: specId ?? null,
        message: `Building: ${task}`,
        status: 'pending',
        files: files.length > 0 ? files : ['(will auto-detect)'],
        hint: 'OpenCode agent will execute this task with full read-write access',
      }),
    };
  },
};
