import OpenAI from 'openai';
import { BaseLLMProvider } from './base.js';
import type { ChatOptions, ChatResponse, Message, StreamChunk } from '../types.js';

export interface OpenAIProviderConfig {
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

export class OpenAIProvider extends BaseLLMProvider {
  readonly name = 'openai';
  private client: OpenAI;
  private defaultModel: string;

  constructor(config: OpenAIProviderConfig) {
    super();
    this.client = new OpenAI({
      apiKey: config.apiKey,
      ...(config.baseUrl ? { baseURL: config.baseUrl } : {}),
    });
    this.defaultModel = config.model ?? 'gpt-4o-mini';
  }

  async isAvailable(): Promise<boolean> {
    return Boolean(this.client.apiKey);
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse> {
    const model = options?.model ?? this.defaultModel;
    const start = performance.now();

    const response = await this.client.chat.completions.create({
      model,
      temperature: options?.temperature,
      max_tokens: options?.maxTokens,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const latencyMs = performance.now() - start;
    const choice = response.choices[0];

    return {
      content: choice?.message?.content ?? '',
      model: response.model,
      provider: this.name,
      tokensUsed: {
        input: response.usage?.prompt_tokens ?? 0,
        output: response.usage?.completion_tokens ?? 0,
      },
      latencyMs,
    };
  }

  async *stream(messages: Message[], options?: ChatOptions): AsyncIterable<StreamChunk> {
    const model = options?.model ?? this.defaultModel;

    const stream = await this.client.chat.completions.create({
      model,
      temperature: options?.temperature,
      max_tokens: options?.maxTokens,
      stream: true,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;
      const finishReason = chunk.choices[0]?.finish_reason;

      yield {
        content: delta?.content ?? '',
        done: finishReason !== null && finishReason !== undefined,
      };
    }
  }
}
