import type { LLMProvider, Message, ChatOptions, StreamChunk } from '../types.js';

export abstract class BaseProvider implements LLMProvider {
  abstract name: string;
  abstract chat(messages: Message[], options?: ChatOptions): AsyncIterable<StreamChunk>;
  abstract isAvailable(): Promise<boolean>;

  protected formatError(error: unknown): StreamChunk {
    const message = error instanceof Error ? error.message : String(error);
    return { type: 'error', error: message };
  }
}
