import { BaseLLMProvider } from './base.js';
import type { ChatOptions, ChatResponse, Message, StreamChunk } from '../types.js';

export interface OllamaProviderConfig {
  baseUrl?: string;
  model?: string;
}

export class OllamaProvider extends BaseLLMProvider {
  readonly name = 'ollama';
  private baseUrl: string;
  private defaultModel: string;

  constructor(config: OllamaProviderConfig = {}) {
    super();
    this.baseUrl = (config.baseUrl ?? 'http://localhost:11434').replace(/\/$/, '');
    this.defaultModel = config.model ?? 'qwen3.5:4b';
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse> {
    const model = options?.model ?? this.defaultModel;
    const start = performance.now();

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        stream: false,
        options: {
          temperature: options?.temperature,
          num_predict: options?.maxTokens,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama chat failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as {
      message: { content: string };
      model: string;
      prompt_eval_count?: number;
      eval_count?: number;
    };

    const latencyMs = performance.now() - start;

    return {
      content: data.message.content,
      model: data.model,
      provider: this.name,
      tokensUsed: {
        input: data.prompt_eval_count ?? 0,
        output: data.eval_count ?? 0,
      },
      latencyMs,
    };
  }

  async *stream(messages: Message[], options?: ChatOptions): AsyncIterable<StreamChunk> {
    const model = options?.model ?? this.defaultModel;

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        stream: true,
        options: {
          temperature: options?.temperature,
          num_predict: options?.maxTokens,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama stream failed: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Ollama stream returned no body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          const chunk = JSON.parse(trimmed) as {
            message?: { content: string };
            done: boolean;
          };

          yield {
            content: chunk.message?.content ?? '',
            done: chunk.done,
          };
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) {
        const chunk = JSON.parse(buffer.trim()) as {
          message?: { content: string };
          done: boolean;
        };
        yield {
          content: chunk.message?.content ?? '',
          done: chunk.done,
        };
      }
    } finally {
      reader.releaseLock();
    }
  }
}
