import type { ChatOptions, ChatResponse, LLMProvider, Message, StreamChunk } from '../types.js';

export abstract class BaseLLMProvider implements LLMProvider {
  abstract readonly name: string;

  abstract chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse>;

  abstract stream(messages: Message[], options?: ChatOptions): AsyncIterable<StreamChunk>;

  abstract isAvailable(): Promise<boolean>;
}
