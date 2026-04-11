import type { Tool, ToolResult } from '@dors/core';
import type { ReviewFinding } from '../types.js';

type ReviewFocus = 'completeness' | 'tone' | 'legal' | 'all';

export function createDocsReviewTool(): Tool {
  return {
    name: 'docs_review',
    description: 'Review a document for completeness, tone, and legal red flags',
    parameters: {
      type: 'object',
      properties: {
        documentId: {
          type: 'string',
          description: 'ID of the document to review',
        },
        focus: {
          type: 'string',
          enum: ['completeness', 'tone', 'legal', 'all'],
          description: 'Review focus area',
        },
      },
      required: ['documentId', 'focus'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      try {
        const documentId = args.documentId as string;
        const focus = args.focus as ReviewFocus;

        // Stub: in production this would load the document and run analysis
        // (potentially via LLM) for each focus area.
        const findings: ReviewFinding[] = [];

        if (focus === 'completeness' || focus === 'all') {
          findings.push({
            category: 'completeness',
            severity: 'info',
            message: 'Stub: completeness check not yet implemented',
          });
        }

        if (focus === 'tone' || focus === 'all') {
          findings.push({
            category: 'tone',
            severity: 'info',
            message: 'Stub: tone analysis not yet implemented',
          });
        }

        if (focus === 'legal' || focus === 'all') {
          findings.push({
            category: 'legal',
            severity: 'info',
            message: 'Stub: legal review not yet implemented',
          });
        }

        return {
          success: true,
          output: JSON.stringify({
            documentId,
            focus,
            findings,
            summary: `Reviewed document ${documentId} with focus: ${focus}`,
          }, null, 2),
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
