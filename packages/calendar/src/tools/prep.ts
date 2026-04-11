import type { Tool, ToolResult } from '@dors/core';
import type { MeetingPrep } from '../types.js';

export function createPrepTool(): Tool {
  return {
    name: 'calendar_prep',
    description: 'Generate meeting preparation notes including agenda, participants, documents, and talking points',
    parameters: {
      type: 'object',
      properties: {
        eventId: {
          type: 'string',
          description: 'The calendar event ID to prepare for',
        },
      },
      required: ['eventId'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      const eventId = args.eventId as string;

      const prep: MeetingPrep = {
        eventId,
        agenda: [
          'Review action items from last meeting',
          'Discuss current sprint progress',
          'Identify blockers and next steps',
        ],
        participants: [
          { name: 'Participant A', context: 'Engineering lead, working on core platform' },
          { name: 'Participant B', context: 'Product manager, owns the roadmap' },
        ],
        documents: [
          'sprint-board.md',
          'architecture-decisions.md',
        ],
        talkingPoints: [
          'Timeline for next milestone',
          'Resource allocation for Q2',
          'Technical debt prioritization',
        ],
      };

      return {
        success: true,
        output: JSON.stringify(prep),
      };
    },
  };
}
