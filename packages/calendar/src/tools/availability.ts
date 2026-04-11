import type { Tool, ToolResult } from '@dors/core';
import type { AvailabilitySlot } from '../types.js';

export function createAvailabilityTool(): Tool {
  return {
    name: 'calendar_availability',
    description: 'Find available time slots and suggest optimal meeting times',
    parameters: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date to check availability (ISO format, e.g. "2026-04-11")',
        },
        duration: {
          type: 'number',
          description: 'Desired meeting duration in minutes',
        },
        preference: {
          type: 'string',
          enum: ['morning', 'afternoon', 'any'],
          description: 'Time of day preference',
        },
      },
      required: ['date', 'duration', 'preference'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      const date = args.date as string;
      const duration = args.duration as number;
      const preference = args.preference as string;

      const slots: AvailabilitySlot[] = [
        { start: `${date}T09:00:00`, end: `${date}T10:00:00`, score: 90 },
        { start: `${date}T10:30:00`, end: `${date}T11:30:00`, score: 85 },
        { start: `${date}T14:00:00`, end: `${date}T15:00:00`, score: 70 },
        { start: `${date}T16:00:00`, end: `${date}T17:00:00`, score: 60 },
      ];

      const filtered = preference === 'any'
        ? slots
        : slots.filter((s) => {
            const hour = parseInt(s.start.split('T')[1].split(':')[0], 10);
            return preference === 'morning' ? hour < 12 : hour >= 12;
          });

      return {
        success: true,
        output: JSON.stringify({
          date,
          duration,
          preference,
          slots: filtered,
        }),
      };
    },
  };
}
