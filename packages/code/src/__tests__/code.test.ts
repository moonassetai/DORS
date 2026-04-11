import { test, expect, describe } from 'vitest';
import { createCodeExtension } from '../index.js';
import { specTool } from '../tools/spec.js';
import { developTool } from '../tools/develop.js';
import { reviewTool } from '../tools/review.js';
import { analyzeTool } from '../tools/analyze.js';

describe('dors-ext-code', () => {
  const ext = createCodeExtension();

  test('extension has correct name', () => {
    expect(ext.name).toBe('dors-ext-code');
  });

  test('extension provides 4 tools', () => {
    expect(ext.tools).toHaveLength(4);
  });

  test('extension has correct tool names', () => {
    const names = ext.tools!.map((t) => t.name);
    expect(names).toContain('code_spec');
    expect(names).toContain('code_develop');
    expect(names).toContain('code_review');
    expect(names).toContain('code_analyze');
  });
});

describe('code_spec tool', () => {
  test('propose creates a specification', async () => {
    const result = await specTool.execute({
      action: 'propose',
      title: 'Add user auth',
      description: 'Implement JWT-based authentication',
    });
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.spec.title).toBe('Add user auth');
    expect(data.spec.phase).toBe('propose');
  });

  test('list returns empty specs', async () => {
    const result = await specTool.execute({ action: 'list' });
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.specs).toEqual([]);
  });

  test('verify checks spec status', async () => {
    const result = await specTool.execute({ action: 'verify', specId: 'spec_123' });
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.checks.requirements_met).toBe(true);
  });
});

describe('code_develop tool', () => {
  test('build mode returns task', async () => {
    const result = await developTool.execute({
      task: 'Add login page',
      mode: 'build',
    });
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.mode).toBe('build');
  });

  test('plan mode returns analysis', async () => {
    const result = await developTool.execute({
      task: 'Understand auth flow',
      mode: 'plan',
    });
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.mode).toBe('plan');
    expect(data.analysis).toBeDefined();
  });

  test('defaults to build mode', async () => {
    const result = await developTool.execute({ task: 'Fix bug' });
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.mode).toBe('build');
  });
});

describe('code_review tool', () => {
  test('reviews staged changes', async () => {
    const result = await reviewTool.execute({ target: 'staged' });
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.review.approved).toBe(true);
  });
});

describe('code_analyze tool', () => {
  test('analyzes current directory by default', async () => {
    const result = await analyzeTool.execute({});
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.analysis.path).toBe('.');
  });
});
