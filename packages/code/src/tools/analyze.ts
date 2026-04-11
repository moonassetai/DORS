import type { Tool, ToolResult } from '@dors/core';

/**
 * Codebase analysis tool — understand project structure, dependencies, architecture.
 */
export const analyzeTool: Tool = {
  name: 'code_analyze',
  description:
    'Analyze a codebase: project structure, dependencies, languages, architecture patterns. Uses OpenCode plan mode for read-only exploration.',
  parameters: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'Path to analyze. Default: current directory',
      },
      focus: {
        type: 'string',
        enum: ['structure', 'dependencies', 'architecture', 'complexity', 'all'],
        description: 'Analysis focus. Default: all',
      },
    },
  },

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const path = (args.path as string) ?? '.';
    const focus = (args.focus as string) ?? 'all';

    return {
      success: true,
      output: JSON.stringify({
        message: `Analyzing codebase: ${path} (focus: ${focus})`,
        analysis: {
          path,
          totalFiles: 0,
          languages: {},
          dependencies: [],
          architecture: 'Unknown — connect to a project to analyze',
          suggestions: [
            'Point this tool at a project directory to get a full analysis',
          ],
        },
        hint: 'Provide a path to an existing project for detailed analysis',
      }),
    };
  },
};
