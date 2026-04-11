import type { Extension } from '@dors/ext';
import type { Tool } from '@dors/core';
import { createSocialDraftTool } from './tools/draft.js';
import { createSocialScheduleTool } from './tools/schedule.js';
import { createSocialAnalyticsTool } from './tools/analytics.js';
import { createSocialCalendarTool } from './tools/calendar.js';

export function createSocialExtension(): Extension {
  const tools: Tool[] = [
    createSocialDraftTool(),
    createSocialScheduleTool(),
    createSocialAnalyticsTool(),
    createSocialCalendarTool(),
  ];

  return {
    name: 'dors-ext-social',
    version: '0.1.0',
    tools,
    async activate() {
      // Social extension activated — no local state to initialize
    },
    async deactivate() {
      // No cleanup needed
    },
  };
}

export default createSocialExtension;

export type {
  SocialPlatform,
  SocialPost,
  EngagementMetrics,
  ContentCalendar,
  AudienceInsight,
} from './types.js';
