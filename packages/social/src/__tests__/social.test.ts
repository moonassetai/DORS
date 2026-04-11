import { describe, it, expect } from 'vitest';
import { createSocialExtension } from '../index.js';
import { createSocialDraftTool } from '../tools/draft.js';
import { createSocialScheduleTool } from '../tools/schedule.js';
import { createSocialAnalyticsTool } from '../tools/analytics.js';
import { createSocialCalendarTool } from '../tools/calendar.js';

describe('social extension', () => {
  it('should create extension with 4 tools', () => {
    const ext = createSocialExtension();
    expect(ext.name).toBe('dors-ext-social');
    expect(ext.version).toBe('0.1.0');
    expect(ext.tools).toHaveLength(4);
  });

  it('should have activate and deactivate', async () => {
    const ext = createSocialExtension();
    await expect(ext.activate()).resolves.toBeUndefined();
    await expect(ext.deactivate()).resolves.toBeUndefined();
  });

  it('should expose all tool names', () => {
    const ext = createSocialExtension();
    const names = ext.tools!.map((t) => t.name);
    expect(names).toContain('social_draft');
    expect(names).toContain('social_schedule');
    expect(names).toContain('social_analytics');
    expect(names).toContain('social_calendar');
  });
});

describe('social_draft', () => {
  const tool = createSocialDraftTool();

  it('should have correct name and description', () => {
    expect(tool.name).toBe('social_draft');
    expect(tool.description).toContain('Draft');
  });

  it('should draft a post for twitter', async () => {
    const result = await tool.execute({
      platform: 'twitter',
      topic: 'AGI safety',
      tone: 'professional',
      includeHashtags: true,
    });

    expect(result.success).toBe(true);
    const post = JSON.parse(result.output);
    expect(post.platform).toBe('twitter');
    expect(post.status).toBe('draft');
    expect(post.hashtags).toContain('#AGIsafety');
    expect(post.hashtags).toContain('#MULTIVAC');
  });

  it('should draft without hashtags', async () => {
    const result = await tool.execute({
      platform: 'linkedin',
      topic: 'open source',
      tone: 'casual',
      includeHashtags: false,
    });

    expect(result.success).toBe(true);
    const post = JSON.parse(result.output);
    expect(post.hashtags).toHaveLength(0);
  });
});

describe('social_schedule', () => {
  const tool = createSocialScheduleTool();

  it('should have correct name', () => {
    expect(tool.name).toBe('social_schedule');
  });

  it('should return approval required message', async () => {
    const result = await tool.execute({
      postId: 'draft-123',
      scheduledFor: '2026-04-15T10:00:00Z',
      platform: 'bluesky',
    });

    expect(result.success).toBe(true);
    expect(result.output).toContain('APPROVAL REQUIRED');
    expect(result.output).toContain('draft-123');
    expect(result.output).toContain('bluesky');
  });
});

describe('social_analytics', () => {
  const tool = createSocialAnalyticsTool();

  it('should have correct name', () => {
    expect(tool.name).toBe('social_analytics');
  });

  it('should return mock metrics for a period', async () => {
    const result = await tool.execute({ period: 'week' });

    expect(result.success).toBe(true);
    expect(result.output).toContain('all platforms');
    expect(result.output).toContain('week');
  });

  it('should filter by platform', async () => {
    const result = await tool.execute({ period: 'month', platform: 'twitter' });

    expect(result.success).toBe(true);
    expect(result.output).toContain('twitter');
  });

  it('should get metrics for a specific post', async () => {
    const result = await tool.execute({ period: 'week', postId: 'post-456' });

    expect(result.success).toBe(true);
    expect(result.output).toContain('post-456');
  });
});

describe('social_calendar', () => {
  const tool = createSocialCalendarTool();

  it('should have correct name', () => {
    expect(tool.name).toBe('social_calendar');
  });

  it('should generate a calendar with themes', async () => {
    const result = await tool.execute({
      action: 'generate',
      themes: ['AI', 'open source'],
    });

    expect(result.success).toBe(true);
    expect(result.output).toContain('AI');
    expect(result.output).toContain('open source');
  });

  it('should view calendar', async () => {
    const result = await tool.execute({ action: 'view' });

    expect(result.success).toBe(true);
    expect(result.output).toContain('Content calendar');
  });

  it('should update calendar', async () => {
    const result = await tool.execute({ action: 'update', week: '2026-W16' });

    expect(result.success).toBe(true);
    expect(result.output).toContain('2026-W16');
    expect(result.output).toContain('updated');
  });
});
