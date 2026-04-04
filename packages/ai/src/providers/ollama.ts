import { BaseProvider } from './base.js';
import type { Message, ChatOptions, StreamChunk } from '../types.js';

export class OllamaProvider extends BaseProvider {
  name = 'ollama';
  private baseUrl: string;

  constructor(baseUrl = 'http://localhost:11434') {
    super();
    this.baseUrl = baseUrl;
  }

  async *chat(messages: Message[], options?: ChatOptions): AsyncIterable<StreamChunk> {
    try {
      const body: Record<string, unknown> = {
        model: options?.model ?? 'qwen3:14b',
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
      };

      if (options?.temperature !== undefined) {
        body.options = { temperature: options.temperature };
      }

      if (options?.tools?.length) {
        body.tools = options.tools.map((t) => ({
          type: 'function',
          function: {
            name: t.name,
            description: t.description,
            parameters: t.parameters,
          },
        }));
      }

      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        yield this.formatError(`Ollama error: ${response.status} ${response.statusText}`);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        yield this.formatError('No response body');
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);

            if (parsed.message?.tool_calls?.length) {
              for (const tc of parsed.message.tool_calls) {
                yield {
                  type: 'tool_call',
                  toolCall: {
                    name: tc.function.name,
                    args: typeof tc.function.arguments === 'string'
                      ? JSON.parse(tc.function.arguments)
                      : tc.function.arguments,
                  },
                };
              }
            } else if (parsed.message?.content) {
              yield { type: 'text', content: parsed.message.content };
            }

            if (parsed.done) {
              yield { type: 'done' };
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    } catch (error) {
      yield this.formatError(error);
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(2000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
