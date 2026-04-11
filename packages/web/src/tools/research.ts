import type { Tool, ToolResult } from '@dors/core';
import type { ResearchReport } from '../types.js';

export function createResearchTool(): Tool {
  return {
    name: 'web_research',
    description: 'Deep research on a topic — multi-page search + synthesis into a report',
    parameters: {
      type: 'object',
      properties: {
        topic: { type: 'string', description: 'Research topic or question' },
        depth: {
          type: 'string',
          enum: ['quick', 'thorough'],
          description: 'Research depth: quick (1-2 sources) or thorough (5+ sources)',
        },
      },
      required: ['topic'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      try {
        const topic = args.topic as string;
        const depth = (args.depth as string) ?? 'quick';
        const sourceCount = depth === 'thorough' ? 5 : 2;

        // Stub: return mock research report
        const report: ResearchReport = {
          query: topic,
          sources: Array.from({ length: sourceCount }, (_, i) => ({
            url: `https://example.com/source-${i + 1}`,
            title: `Source ${i + 1}: ${topic}`,
            snippet: `[stub] Research source ${i + 1} for "${topic}"`,
            score: 1 - i * 0.05,
          })),
          summary: `[stub] Research summary for "${topic}" (${depth} depth, ${sourceCount} sources)`,
          keyFindings: [
            `[stub] Key finding 1 about ${topic}`,
            `[stub] Key finding 2 about ${topic}`,
          ],
          recommendations: [
            `[stub] Recommendation 1 based on ${topic} research`,
          ],
        };

        return {
          success: true,
          output: JSON.stringify(report, null, 2),
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
