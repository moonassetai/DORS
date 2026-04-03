import type { Message } from '../llm-router/types.js';
import type { AgentMessage } from './types.js';

export class ConversationContext {
  private messages: AgentMessage[] = [];
  private maxHistory: number;

  constructor(maxHistory = 50) {
    this.maxHistory = maxHistory;
  }

  add(message: AgentMessage): void {
    this.messages.push(message);
    if (this.messages.length > this.maxHistory) {
      this.messages = this.messages.slice(-this.maxHistory);
    }
  }

  getMessages(): AgentMessage[] {
    return [...this.messages];
  }

  getLastN(n: number): AgentMessage[] {
    return this.messages.slice(-n);
  }

  clear(): void {
    this.messages = [];
  }

  toPromptMessages(systemPrompt: string): Message[] {
    const result: Message[] = [{ role: 'system', content: systemPrompt }];
    for (const msg of this.messages) {
      result.push({ role: msg.role, content: msg.content });
    }
    return result;
  }
}
