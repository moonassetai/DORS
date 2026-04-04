import type { StreamChunk } from '@dors/ai';
import { createDorsAgent, type DorsAgent } from './dors.js';

export interface HeadlessOptions {
  configPath?: string;
}

export class HeadlessAgent {
  private agent: DorsAgent;

  constructor(options?: HeadlessOptions) {
    this.agent = createDorsAgent(options?.configPath);
  }

  async send(message: string): Promise<string> {
    let response = '';
    for await (const chunk of this.agent.loop.processMessage(message)) {
      if (chunk.type === 'text' && chunk.content) {
        response += chunk.content;
      }
    }
    return response;
  }

  async *stream(message: string): AsyncIterable<StreamChunk> {
    yield* this.agent.loop.processMessage(message);
  }

  get config() {
    return this.agent.config;
  }

  get memory() {
    return this.agent.memory;
  }

  get conversations() {
    return this.agent.conversations;
  }
}
