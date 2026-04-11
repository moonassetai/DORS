import type { Tool, ToolResult } from '@dors/core';
import type { SocialPlatform } from '../types.js';

export function createSocialScheduleTool(): Tool {
  return {
    name: 'social_schedule',
    description: 'Schedule a social media post for publishing (requires approval — external action)',
    parameters: {
      type: 'object',
      properties: {
        postId: {
          type: 'string',
          description: 'ID of the draft post to schedule',
        },
        scheduledFor: {
          type: 'string',
          description: 'ISO 8601 datetime for when to publish',
        },
        platform: {
          type: 'string',
          enum: ['twitter', 'linkedin', 'instagram', 'bluesky', 'threads'],
          description: 'Target social media platform',
        },
      },
      required: ['postId', 'scheduledFor', 'platform'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      const postId = args.postId as string;
      const scheduledFor = args.scheduledFor as string;
      const platform = args.platform as SocialPlatform;

      // Stub: Scheduling is an external action that requires user approval.
      // In production, this would queue the post via the platform's API
      // after receiving explicit user confirmation.
      return {
        success: true,
        output: [
          `[APPROVAL REQUIRED] Schedule post for publishing:`,
          `  Post ID: ${postId}`,
          `  Platform: ${platform}`,
          `  Scheduled for: ${scheduledFor}`,
          ``,
          `This is an external action. User must approve before the post is sent to the ${platform} API.`,
        ].join('\n'),
      };
    },
  };
}
