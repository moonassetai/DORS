import type { Tool, ToolResult } from '@dors/core';
import type { ContentCalendar, SocialPost } from '../types.js';

export function createSocialCalendarTool(): Tool {
  return {
    name: 'social_calendar',
    description: 'Plan and manage a content calendar for social media',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['generate', 'view', 'update'],
          description: 'Calendar action to perform',
        },
        week: {
          type: 'string',
          description: 'ISO week string, e.g. "2026-W15" (optional)',
        },
        themes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Content themes to focus on (optional, used with generate)',
        },
      },
      required: ['action'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      const action = args.action as 'generate' | 'view' | 'update';
      const week = args.week as string | undefined;
      const themes = args.themes as string[] | undefined;

      // Stub: In production, this would persist calendars and coordinate
      // with the draft tool to pre-fill posts.
      const currentWeek = week ?? `2026-W${String(Math.ceil((Date.now() - new Date('2026-01-01').getTime()) / 604800000)).padStart(2, '0')}`;

      if (action === 'generate') {
        const calendar: ContentCalendar = {
          week: currentWeek,
          posts: [],
          themes: themes ?? ['product updates', 'behind the scenes', 'community'],
        };

        return {
          success: true,
          output: [
            `Generated content calendar for ${currentWeek}:`,
            `Themes: ${calendar.themes.join(', ')}`,
            ``,
            `Calendar is empty — use social_draft to create posts, then add them here.`,
          ].join('\n'),
        };
      }

      if (action === 'view') {
        return {
          success: true,
          output: [
            `Content calendar for ${currentWeek}:`,
            ``,
            `No posts scheduled yet. Use social_calendar with action "generate" to start planning.`,
          ].join('\n'),
        };
      }

      // action === 'update'
      return {
        success: true,
        output: `Calendar for ${currentWeek} updated. Use social_calendar with action "view" to review.`,
      };
    },
  };
}
