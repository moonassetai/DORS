import type { LLMProvider, Message, ChatOptions, StreamChunk } from './types.js';

export interface RouterConfig {
  primary: LLMProvider;
  fallback?: LLMProvider;
}

export class LLMRouter {
  private primary: LLMProvider;
  private fallback?: LLMProvider;

  constructor(config: RouterConfig) {
    this.primary = config.primary;
    this.fallback = config.fallback;
  }

  async *chat(messages: Message[], options?: ChatOptions): AsyncIterable<StreamChunk> {
    const provider = await this.selectProvider();

    yield* provider.chat(messages, options);
  }

  private async selectProvider(): Promise<LLMProvider> {
    if (await this.primary.isAvailable()) {
      return this.primary;
    }

    if (this.fallback && (await this.fallback.isAvailable())) {
      return this.fallback;
    }

    throw new Error(
      `No LLM provider available. Primary: ${this.primary.name}, Fallback: ${this.fallback?.name ?? 'none'}`,
    );
  }

  get providerName(): string {
    return this.primary.name;
  }
}
