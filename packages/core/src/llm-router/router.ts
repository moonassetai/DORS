import type { ChatOptions, ChatResponse, LLMProvider, Message, StreamChunk } from './types.js';

export interface LLMRouterConfig {
  providers: LLMProvider[];
  defaultProvider: string;
  failoverOrder?: string[];
}

export class LLMRouter {
  private providers: Map<string, LLMProvider>;
  private defaultProvider: string;
  private failoverOrder: string[];

  constructor(config: LLMRouterConfig) {
    this.providers = new Map();
    for (const provider of config.providers) {
      this.providers.set(provider.name, provider);
    }

    if (!this.providers.has(config.defaultProvider)) {
      throw new Error(
        `Default provider "${config.defaultProvider}" not found in providers list`
      );
    }

    this.defaultProvider = config.defaultProvider;
    this.failoverOrder = config.failoverOrder ?? [];
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse> {
    return this.tryWithFailover((provider) => provider.chat(messages, options));
  }

  async *stream(
    messages: Message[],
    options?: ChatOptions
  ): AsyncIterable<StreamChunk> {
    const provider = await this.resolveProvider();
    yield* provider.stream(messages, options);
  }

  getProvider(name: string): LLMProvider | undefined {
    return this.providers.get(name);
  }

  async getAvailableProviders(): Promise<LLMProvider[]> {
    const results = await Promise.all(
      Array.from(this.providers.values()).map(async (provider) => {
        const available = await provider.isAvailable();
        return available ? provider : null;
      })
    );
    return results.filter((p): p is LLMProvider => p !== null);
  }

  private async tryWithFailover<T>(
    operation: (provider: LLMProvider) => Promise<T>
  ): Promise<T> {
    const chain = [
      this.defaultProvider,
      ...this.failoverOrder.filter((name) => name !== this.defaultProvider),
    ];

    const errors: Error[] = [];

    for (const name of chain) {
      const provider = this.providers.get(name);
      if (!provider) continue;

      try {
        const available = await provider.isAvailable();
        if (!available) {
          errors.push(new Error(`Provider "${name}" is not available`));
          continue;
        }
        return await operation(provider);
      } catch (error) {
        errors.push(
          error instanceof Error
            ? error
            : new Error(`Provider "${name}" failed: ${String(error)}`)
        );
      }
    }

    throw new AggregateError(
      errors,
      `All providers failed: ${errors.map((e) => e.message).join('; ')}`
    );
  }

  private async resolveProvider(): Promise<LLMProvider> {
    const chain = [
      this.defaultProvider,
      ...this.failoverOrder.filter((name) => name !== this.defaultProvider),
    ];

    for (const name of chain) {
      const provider = this.providers.get(name);
      if (!provider) continue;

      try {
        const available = await provider.isAvailable();
        if (available) return provider;
      } catch {
        continue;
      }
    }

    throw new Error('No available providers for streaming');
  }
}
