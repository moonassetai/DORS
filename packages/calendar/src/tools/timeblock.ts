import type { Tool, ToolResult } from '@dors/core';
import type { TimeBlock } from '../types.js';

export function createTimeBlockTool(): Tool {
  return {
    name: 'calendar_timeblock',
    description: 'Auto-generate time blocks for the day based on tasks and priorities',
    parameters: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date to generate time blocks for (ISO format, e.g. "2026-04-11")',
        },
        tasks: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of tasks to schedule into time blocks',
        },
      },
      required: ['date', 'tasks'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      const date = args.date as string;
      const tasks = args.tasks as string[];

      const blocks: TimeBlock[] = [
        { start: `${date}T09:00:00`, end: `${date}T11:00:00`, label: 'deep_work' },
        { start: `${date}T11:00:00`, end: `${date}T11:30:00`, label: 'break' },
        { start: `${date}T11:30:00`, end: `${date}T12:30:00`, label: 'meetings' },
        { start: `${date}T12:30:00`, end: `${date}T13:30:00`, label: 'break' },
        { start: `${date}T13:30:00`, end: `${date}T15:30:00`, label: 'deep_work' },
        { start: `${date}T15:30:00`, end: `${date}T16:30:00`, label: 'admin' },
        { start: `${date}T16:30:00`, end: `${date}T17:00:00`, label: 'personal' },
      ];

      return {
        success: true,
        output: JSON.stringify({
          date,
          tasks,
          blocks,
        }),
      };
    },
  };
}
