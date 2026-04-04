import { BaseProvider } from './base.js';
import type { Message, ChatOptions, StreamChunk } from '../types.js';

export class OpenAIProvider extends BaseProvider {
  name = 'openai';
  private apiKey: string;
  private baseUrl?: string;

  constructor(apiKey?: string, baseUrl?: string) {
    super();
    this.apiKey = apiKey ?? process.env.OPENAI_API_KEY ?? '';
    this.baseUrl = baseUrl;
  }

  async *chat(messages: Message[], options?: ChatOptions): AsyncIterable<StreamChunk> {
    try {
      const { default: OpenAI } = await import('openai');
      const client = new OpenAI({
        apiKey: this.apiKey,
        ...(this.baseUrl ? { baseURL: this.baseUrl } : {}),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: any = {
        model: options?.model ?? 'gpt-4o',
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
          ...(m.toolCallId ? { tool_call_id: m.toolCallId } : {}),
        })),
        stream: true,
      };

      if (options?.temperature !== undefined) {
        params.temperature = options.temperature;
      }

      if (options?.maxTokens) {
        params.max_tokens = options.maxTokens;
      }

      if (options?.tools?.length) {
        params.tools = options.tools.map((t) => ({
          type: 'function',
          function: {
            name: t.name,
            description: t.description,
            parameters: t.parameters,
          },
        }));
      }

      const stream = await client.chat.completions.create(params);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for await (const chunk of stream as any) {
        const choices = chunk.choices;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const delta = choices?.[0]?.delta as any;

        if (delta?.content) {
          yield { type: 'text', content: delta.content as string };
        }

        if (delta?.tool_calls?.length) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          for (const tc of delta.tool_calls as any[]) {
            if (tc.function?.name) {
              yield {
                type: 'tool_call',
                toolCall: {
                  name: tc.function.name as string,
                  args: typeof tc.function.arguments === 'string'
                    ? JSON.parse(tc.function.arguments)
                    : tc.function.arguments ?? {},
                },
              };
            }
          }
        }

        if (choices?.[0]?.finish_reason === 'stop') {
          yield { type: 'done' };
        }
      }
    } catch (error) {
      yield this.formatError(error);
    }
  }

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey;
  }
}
