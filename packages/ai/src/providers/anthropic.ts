import { BaseProvider } from './base.js';
import type { Message, ChatOptions, StreamChunk } from '../types.js';

export class AnthropicProvider extends BaseProvider {
  name = 'anthropic';
  private apiKey: string;

  constructor(apiKey?: string) {
    super();
    this.apiKey = apiKey ?? process.env.ANTHROPIC_API_KEY ?? '';
  }

  async *chat(messages: Message[], options?: ChatOptions): AsyncIterable<StreamChunk> {
    try {
      const { default: Anthropic } = await import('@anthropic-ai/sdk');
      const client = new Anthropic({ apiKey: this.apiKey });

      const systemMsg = messages.find((m) => m.role === 'system');
      const chatMessages = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: any = {
        model: options?.model ?? 'claude-sonnet-4-6',
        max_tokens: options?.maxTokens ?? 4096,
        messages: chatMessages,
      };

      if (systemMsg) {
        params.system = systemMsg.content;
      }

      if (options?.temperature !== undefined) {
        params.temperature = options.temperature;
      }

      if (options?.tools?.length) {
        params.tools = options.tools.map((t) => ({
          name: t.name,
          description: t.description,
          input_schema: t.parameters,
        }));
      }

      const stream = client.messages.stream(params);

      for await (const event of stream) {
        if (event.type === 'content_block_delta') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const delta = event.delta as any;
          if (delta.type === 'text_delta') {
            yield { type: 'text', content: delta.text as string };
          }
        } else if (event.type === 'message_stop') {
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
