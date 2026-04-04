import { describe, it, expect, vi } from 'vitest';
import { LLMRouter } from '../router.js';
import type { LLMProvider, Message, StreamChunk } from '../types.js';

function createMockProvider(name: string, available: boolean): LLMProvider {
  return {
    name,
    async *chat(_messages: Message[]): AsyncIterable<StreamChunk> {
      yield { type: 'text', content: `Hello from ${name}` };
      yield { type: 'done' };
    },
    isAvailable: vi.fn().mockResolvedValue(available),
  };
}

describe('LLMRouter', () => {
  it('should use primary provider when available', async () => {
    const primary = createMockProvider('primary', true);
    const fallback = createMockProvider('fallback', true);
    const router = new LLMRouter({ primary, fallback });

    const chunks: StreamChunk[] = [];
    for await (const chunk of router.chat([{ role: 'user', content: 'hi' }])) {
      chunks.push(chunk);
    }

    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toEqual({ type: 'text', content: 'Hello from primary' });
    expect(primary.isAvailable).toHaveBeenCalled();
  });

  it('should fall back when primary is unavailable', async () => {
    const primary = createMockProvider('primary', false);
    const fallback = createMockProvider('fallback', true);
    const router = new LLMRouter({ primary, fallback });

    const chunks: StreamChunk[] = [];
    for await (const chunk of router.chat([{ role: 'user', content: 'hi' }])) {
      chunks.push(chunk);
    }

    expect(chunks[0]).toEqual({ type: 'text', content: 'Hello from fallback' });
  });

  it('should throw when no provider is available', async () => {
    const primary = createMockProvider('primary', false);
    const router = new LLMRouter({ primary });

    await expect(async () => {
      for await (const _chunk of router.chat([{ role: 'user', content: 'hi' }])) {
        // consume
      }
    }).rejects.toThrow('No LLM provider available');
  });

  it('should expose provider name', () => {
    const primary = createMockProvider('ollama', true);
    const router = new LLMRouter({ primary });
    expect(router.providerName).toBe('ollama');
  });
});
