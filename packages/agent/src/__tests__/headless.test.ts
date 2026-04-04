import { describe, it, expect } from 'vitest';
import { HeadlessAgent } from '../headless.js';

describe('HeadlessAgent', () => {
  it('should create with default config', () => {
    // This will use default config (no real LLM needed for construction)
    const agent = new HeadlessAgent({ configPath: '/nonexistent/config.toml' });
    expect(agent.config).toBeDefined();
    expect(agent.config.identity.name).toBe('DORS');
  });

  it('should expose memory store', () => {
    const agent = new HeadlessAgent({ configPath: '/nonexistent/config.toml' });
    expect(agent.memory).toBeDefined();
  });

  it('should expose conversations store', () => {
    const agent = new HeadlessAgent({ configPath: '/nonexistent/config.toml' });
    expect(agent.conversations).toBeDefined();
  });
});
