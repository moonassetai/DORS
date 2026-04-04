import { describe, it, expect } from 'vitest';
import { loadConfig } from '../dors.js';

describe('loadConfig', () => {
  it('should return default config when no file exists', () => {
    const config = loadConfig('/nonexistent/path/config.toml');
    expect(config.identity.name).toBe('DORS');
    expect(config.llm.provider).toBe('ollama');
    expect(config.safety.three_laws).toBe(true);
  });

  it('should have correct default storage path', () => {
    const config = loadConfig('/nonexistent/path/config.toml');
    expect(config.storage.path).toContain('.dors');
    expect(config.storage.path).toContain('dors.db');
  });

  it('should have correct default safety settings', () => {
    const config = loadConfig('/nonexistent/path/config.toml');
    expect(config.safety.allow_shell).toBe(true);
    expect(config.safety.allow_network).toBe(false);
  });
});
