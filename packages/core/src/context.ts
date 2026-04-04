import type { Message } from '@dors/ai';

export interface ContextConfig {
  maxMessages: number;
  maxTokenEstimate: number;
}

const DEFAULT_CONFIG: ContextConfig = {
  maxMessages: 50,
  maxTokenEstimate: 8000,
};

export class ContextManager {
  private messages: Message[] = [];
  private config: ContextConfig;

  constructor(config?: Partial<ContextConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  add(message: Message): void {
    this.messages.push(message);
    this.trim();
  }

  getMessages(): Message[] {
    return [...this.messages];
  }

  clear(): void {
    this.messages = [];
  }

  private trim(): void {
    // Keep system messages, trim oldest non-system messages
    const systemMessages = this.messages.filter((m) => m.role === 'system');
    const chatMessages = this.messages.filter((m) => m.role !== 'system');

    while (chatMessages.length > this.config.maxMessages) {
      chatMessages.shift();
    }

    // Estimate tokens (rough: 4 chars per token)
    let totalChars = chatMessages.reduce((sum, m) => sum + m.content.length, 0);
    while (totalChars > this.config.maxTokenEstimate * 4 && chatMessages.length > 2) {
      const removed = chatMessages.shift();
      if (removed) {
        totalChars -= removed.content.length;
      }
    }

    this.messages = [...systemMessages, ...chatMessages];
  }

  get length(): number {
    return this.messages.length;
  }
}
