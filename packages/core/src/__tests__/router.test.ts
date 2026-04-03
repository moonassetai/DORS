import { describe, it, expect, vi } from 'vitest';
import { LLMRouter } from '../llm-router/router.js';
import type { ChatResponse, LLMProvider, StreamChunk } from '../llm-router/types.js';

function createMockProvider(
  name: string,
  overrides: Partial<LLMProvider> = {}
): LLMProvider {
  return {
    name,
    chat: vi.fn<LLMProvider['chat']>().mockResolvedValue({
      content: `Response from ${name}`,
      model: `${name}-model`,
      provider: name,
      tokensUsed: { input: 10, output: 20 },
      latencyMs: 100,
    }),
    stream: vi.fn<LLMProvider['stream']>().mockImplementation(async function* () {
      yield { content: `Chunk from ${name}`, done: false };
      yield { content: '', done: true };
    }),
    isAvailable: vi.fn<LLMProvider['isAvailable']>().mockResolvedValue(true),
    ...overrides,
  };
}

describe('LLMRouter', () => {
  it('routes chat to default provider', async () => {
    const primary = createMockProvider('primary');
    const router = new LLMRouter({
      providers: [primary],
      defaultProvider: 'primary',
    });

    const response = await router.chat([{ role: 'user', content: 'hello' }]);

    expect(response.content).toBe('Response from primary');
    expect(response.provider).toBe('primary');
    expect(primary.chat).toHaveBeenCalledOnce();
  });

  it('throws if default provider is not in provider list', () => {
    const provider = createMockProvider('alpha');

    expect(
      () =>
        new LLMRouter({
          providers: [provider],
          defaultProvider: 'nonexistent',
        })
    ).toThrow('Default provider "nonexistent" not found');
  });

  it('fails over to next provider when default is unavailable', async () => {
    const primary = createMockProvider('primary', {
      isAvailable: vi.fn<LLMProvider['isAvailable']>().mockResolvedValue(false),
    });
    const fallback = createMockProvider('fallback');

    const router = new LLMRouter({
      providers: [primary, fallback],
      defaultProvider: 'primary',
      failoverOrder: ['primary', 'fallback'],
    });

    const response = await router.chat([{ role: 'user', content: 'hello' }]);

    expect(response.content).toBe('Response from fallback');
    expect(response.provider).toBe('fallback');
  });

  it('fails over when default provider throws', async () => {
    const primary = createMockProvider('primary', {
      chat: vi.fn<LLMProvider['chat']>().mockRejectedValue(new Error('API down')),
    });
    const fallback = createMockProvider('fallback');

    const router = new LLMRouter({
      providers: [primary, fallback],
      defaultProvider: 'primary',
      failoverOrder: ['primary', 'fallback'],
    });

    const response = await router.chat([{ role: 'user', content: 'hello' }]);

    expect(response.content).toBe('Response from fallback');
  });

  it('throws AggregateError when all providers fail', async () => {
    const primary = createMockProvider('primary', {
      chat: vi.fn<LLMProvider['chat']>().mockRejectedValue(new Error('Primary down')),
    });
    const fallback = createMockProvider('fallback', {
      chat: vi.fn<LLMProvider['chat']>().mockRejectedValue(new Error('Fallback down')),
    });

    const router = new LLMRouter({
      providers: [primary, fallback],
      defaultProvider: 'primary',
      failoverOrder: ['primary', 'fallback'],
    });

    await expect(
      router.chat([{ role: 'user', content: 'hello' }])
    ).rejects.toThrow('All providers failed');
  });

  it('getProvider returns provider by name', () => {
    const alpha = createMockProvider('alpha');
    const beta = createMockProvider('beta');
    const router = new LLMRouter({
      providers: [alpha, beta],
      defaultProvider: 'alpha',
    });

    expect(router.getProvider('alpha')).toBe(alpha);
    expect(router.getProvider('beta')).toBe(beta);
    expect(router.getProvider('gamma')).toBeUndefined();
  });

  it('getAvailableProviders filters by availability', async () => {
    const available = createMockProvider('available');
    const unavailable = createMockProvider('unavailable', {
      isAvailable: vi.fn<LLMProvider['isAvailable']>().mockResolvedValue(false),
    });

    const router = new LLMRouter({
      providers: [available, unavailable],
      defaultProvider: 'available',
    });

    const result = await router.getAvailableProviders();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('available');
  });

  it('stream yields chunks from default provider', async () => {
    const primary = createMockProvider('primary');
    const router = new LLMRouter({
      providers: [primary],
      defaultProvider: 'primary',
    });

    const chunks: StreamChunk[] = [];
    for await (const chunk of router.stream([{ role: 'user', content: 'hello' }])) {
      chunks.push(chunk);
    }

    expect(chunks).toHaveLength(2);
    expect(chunks[0].content).toBe('Chunk from primary');
    expect(chunks[1].done).toBe(true);
  });

  it('stream falls over to available provider', async () => {
    const primary = createMockProvider('primary', {
      isAvailable: vi.fn<LLMProvider['isAvailable']>().mockResolvedValue(false),
    });
    const fallback = createMockProvider('fallback');

    const router = new LLMRouter({
      providers: [primary, fallback],
      defaultProvider: 'primary',
      failoverOrder: ['primary', 'fallback'],
    });

    const chunks: StreamChunk[] = [];
    for await (const chunk of router.stream([{ role: 'user', content: 'hello' }])) {
      chunks.push(chunk);
    }

    expect(chunks[0].content).toBe('Chunk from fallback');
  });

  it('does not duplicate default provider in failover chain', async () => {
    const primary = createMockProvider('primary', {
      isAvailable: vi.fn<LLMProvider['isAvailable']>().mockResolvedValue(false),
    });
    const fallback = createMockProvider('fallback');

    const router = new LLMRouter({
      providers: [primary, fallback],
      defaultProvider: 'primary',
      failoverOrder: ['primary', 'fallback'],
    });

    const response = await router.chat([{ role: 'user', content: 'hello' }]);

    // primary.isAvailable should be called once, not twice
    expect(primary.isAvailable).toHaveBeenCalledOnce();
    expect(response.provider).toBe('fallback');
  });
});
