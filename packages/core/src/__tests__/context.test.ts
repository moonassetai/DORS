import { describe, it, expect } from 'vitest';
import { ContextManager } from '../context.js';

describe('ContextManager', () => {
  it('should add and retrieve messages', () => {
    const ctx = new ContextManager();
    ctx.add({ role: 'user', content: 'hello' });
    ctx.add({ role: 'assistant', content: 'hi' });
    expect(ctx.getMessages()).toHaveLength(2);
  });

  it('should trim to max messages', () => {
    const ctx = new ContextManager({ maxMessages: 3, maxTokenEstimate: 100000 });
    for (let i = 0; i < 10; i++) {
      ctx.add({ role: 'user', content: `msg ${i}` });
    }
    expect(ctx.length).toBeLessThanOrEqual(4); // 3 + possible system
  });

  it('should preserve system messages during trim', () => {
    const ctx = new ContextManager({ maxMessages: 2, maxTokenEstimate: 100000 });
    ctx.add({ role: 'system', content: 'system prompt' });
    for (let i = 0; i < 5; i++) {
      ctx.add({ role: 'user', content: `msg ${i}` });
    }
    const msgs = ctx.getMessages();
    expect(msgs[0].role).toBe('system');
  });

  it('should clear all messages', () => {
    const ctx = new ContextManager();
    ctx.add({ role: 'user', content: 'hello' });
    ctx.clear();
    expect(ctx.length).toBe(0);
  });
});
