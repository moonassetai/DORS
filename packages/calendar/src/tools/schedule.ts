import type { Tool, ToolResult } from '@dors/core';
import type { CalendarEvent } from '../types.js';

export function createScheduleTool(): Tool {
  return {
    name: 'calendar_schedule',
    description: 'Manage calendar events: create, update, or cancel',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['create', 'update', 'cancel'],
          description: 'The action to perform on the calendar event',
        },
        event: {
          type: 'object',
          description: 'Partial CalendarEvent data for the action',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            start: { type: 'string' },
            end: { type: 'string' },
            location: { type: 'string' },
            attendees: { type: 'array', items: { type: 'string' } },
            reminders: { type: 'array', items: { type: 'number' } },
            recurrence: { type: 'string' },
          },
        },
      },
      required: ['action', 'event'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      const action = args.action as string;
      const event = args.event as Partial<CalendarEvent>;

      switch (action) {
        case 'create':
          return {
            success: true,
            output: `Created event "${event.title}" from ${event.start} to ${event.end}`,
          };
        case 'update':
          return {
            success: true,
            output: `Updated event "${event.id}": ${event.title ?? 'no title change'}`,
          };
        case 'cancel':
          return {
            success: true,
            output: `Cancelled event "${event.id}"`,
          };
        default:
          return {
            success: false,
            output: '',
            error: `Unknown action: ${action}`,
          };
      }
    },
  };
}
