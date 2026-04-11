import type { Extension } from '@dors/ext';
import type { Tool } from '@dors/core';
import { createScheduleTool } from './tools/schedule.js';
import { createAvailabilityTool } from './tools/availability.js';
import { createPrepTool } from './tools/prep.js';
import { createTimeBlockTool } from './tools/timeblock.js';

export function createCalendarExtension(): Extension {
  const tools: Tool[] = [
    createScheduleTool(),
    createAvailabilityTool(),
    createPrepTool(),
    createTimeBlockTool(),
  ];

  return {
    name: 'dors-ext-calendar',
    version: '0.1.0',
    tools,
    async activate() {
      // Initialize calendar provider connections
    },
    async deactivate() {
      // Clean up provider connections
    },
  };
}

export const calendarExtension = createCalendarExtension;

export default createCalendarExtension;

export type {
  CalendarProvider,
  CalendarEvent,
  TimeBlock,
  TimeBlockLabel,
  MeetingPrep,
  MeetingPrepParticipant,
  AvailabilitySlot,
} from './types.js';
