import type { Tool, ToolResult } from '@dors/core';
import type { SocialPlatform, SocialPost } from '../types.js';

export function createSocialDraftTool(): Tool {
  return {
    name: 'social_draft',
    description: 'Draft a social media post optimized for a specific platform',
    parameters: {
      type: 'object',
      properties: {
        platform: {
          type: 'string',
          enum: ['twitter', 'linkedin', 'instagram', 'bluesky', 'threads'],
          description: 'Target social media platform',
        },
        topic: {
          type: 'string',
          description: 'Topic or subject for the post',
        },
        tone: {
          type: 'string',
          enum: ['professional', 'casual', 'promotional', 'educational'],
          description: 'Tone of the post',
        },
        includeHashtags: {
          type: 'boolean',
          description: 'Whether to include relevant hashtags',
        },
      },
      required: ['platform', 'topic', 'tone', 'includeHashtags'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      const platform = args.platform as SocialPlatform;
      const topic = args.topic as string;
      const tone = args.tone as string;
      const includeHashtags = args.includeHashtags as boolean;

      // Stub: In production, this would call the LLM to generate optimized content
      const charLimits: Record<SocialPlatform, number> = {
        twitter: 280,
        linkedin: 3000,
        instagram: 2200,
        bluesky: 300,
        threads: 500,
      };

      const draft: SocialPost = {
        id: `draft-${Date.now()}`,
        platform,
        content: `[Draft] ${tone} post about "${topic}" for ${platform} (max ${charLimits[platform]} chars)`,
        mediaUrls: [],
        hashtags: includeHashtags ? [`#${topic.replace(/\s+/g, '')}`, '#MULTIVAC'] : [],
        scheduledFor: null,
        status: 'draft',
      };

      return {
        success: true,
        output: JSON.stringify(draft, null, 2),
      };
    },
  };
}
