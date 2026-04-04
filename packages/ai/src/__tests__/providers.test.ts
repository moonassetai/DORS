import { describe, it, expect } from 'vitest';
import { OllamaProvider } from '../providers/ollama.js';
import { AnthropicProvider } from '../providers/anthropic.js';
import { OpenAIProvider } from '../providers/openai.js';

describe('OllamaProvider', () => {
  it('should have correct name', () => {
    const provider = new OllamaProvider();
    expect(provider.name).toBe('ollama');
  });

  it('should use custom base URL', () => {
    const provider = new OllamaProvider('http://custom:1234');
    expect(provider.name).toBe('ollama');
  });

  it('should return false when ollama is not running', async () => {
    const provider = new OllamaProvider('http://localhost:99999');
    const available = await provider.isAvailable();
    expect(available).toBe(false);
  });
});

describe('AnthropicProvider', () => {
  it('should have correct name', () => {
    const provider = new AnthropicProvider('test-key');
    expect(provider.name).toBe('anthropic');
  });

  it('should be available when API key is set', async () => {
    const provider = new AnthropicProvider('sk-test');
    expect(await provider.isAvailable()).toBe(true);
  });

  it('should not be available without API key', async () => {
    const provider = new AnthropicProvider('');
    expect(await provider.isAvailable()).toBe(false);
  });
});

describe('OpenAIProvider', () => {
  it('should have correct name', () => {
    const provider = new OpenAIProvider('test-key');
    expect(provider.name).toBe('openai');
  });

  it('should be available when API key is set', async () => {
    const provider = new OpenAIProvider('sk-test');
    expect(await provider.isAvailable()).toBe(true);
  });

  it('should not be available without API key', async () => {
    const provider = new OpenAIProvider('');
    expect(await provider.isAvailable()).toBe(false);
  });
});
