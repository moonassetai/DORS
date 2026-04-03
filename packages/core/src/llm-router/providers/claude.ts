import Anthropic from '@anthropic-ai/sdk';
import { BaseLLMProvider } from './base.js';
import type { ChatOptions, ChatResponse, Message, StreamChunk } from '../types.js';

export interface ClaudeProviderConfig {
  apiKey: string;
  model?: string;
}

export class ClaudeProvider extends BaseLLMProvider {
  readonly name = 'claude';
  private client: Anthropic;
  private defaultModel: string;

  constructor(config: ClaudeProviderConfig) {
    super();
    this.client = new Anthropic({ apiKey: config.apiKey });
    this.defaultModel = config.model ?? 'claude-sonnet-4-20250514';
  }

  async isAvailable(): Promise<boolean> {
    return Boolean(this.client.apiKey);
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse> {
    const model = options?.model ?? this.defaultModel;
    const { systemPrompt, chatMessages } = this.extractSystem(messages);
    const start = performance.now();

    const response = await this.client.messages.create({
      model,
      max_tokens: options?.maxTokens ?? 4096,
      temperature: options?.temperature,
      ...(systemPrompt ? { system: systemPrompt } : {}),
      messages: chatMessages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const latencyMs = performance.now() - start;
    const textBlock = response.content.find((block) => block.type === 'text');

    return {
      content: textBlock?.text ?? '',
      model: response.model,
      provider: this.name,
      tokensUsed: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
      latencyMs,
    };
  }

  async *stream(messages: Message[], options?: ChatOptions): AsyncIterable<StreamChunk> {
    const model = options?.model ?? this.defaultModel;
    const { systemPrompt, chatMessages } = this.extractSystem(messages);

    const stream = this.client.messages.stream({
      model,
      max_tokens: options?.maxTokens ?? 4096,
      temperature: options?.temperature,
      ...(systemPrompt ? { system: systemPrompt } : {}),
      messages: chatMessages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        yield { content: event.delta.text, done: false };
      }
    }

    yield { content: '', done: true };
  }

  private extractSystem(messages: Message[]): {
    systemPrompt: string | undefined;
    chatMessages: Message[];
  } {
    const systemMessages = messages.filter((m) => m.role === 'system');
    const chatMessages = messages.filter((m) => m.role !== 'system');
    const systemPrompt =
      systemMessages.length > 0
        ? systemMessages.map((m) => m.content).join('\n\n')
        : undefined;
    return { systemPrompt, chatMessages };
  }
}
