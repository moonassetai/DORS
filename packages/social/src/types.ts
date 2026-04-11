export type SocialPlatform = 'twitter' | 'linkedin' | 'instagram' | 'bluesky' | 'threads';

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  content: string;
  mediaUrls: string[];
  hashtags: string[];
  scheduledFor: string | null;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
}

export interface EngagementMetrics {
  postId: string;
  likes: number;
  reposts: number;
  replies: number;
  impressions: number;
  clicks: number;
  fetchedAt: string;
}

export interface ContentCalendar {
  week: string;
  posts: SocialPost[];
  themes: string[];
}

export interface AudienceInsight {
  platform: SocialPlatform;
  followers: number;
  growth: number;
  topContent: string[];
  bestTimes: string[];
}
