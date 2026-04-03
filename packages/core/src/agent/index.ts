import type { LLMRouter, ChatMessage, CompletionResult } from "../router/index.js";

export interface AgentConfig {
  name: string;
  persona: string;
  router: LLMRouter;
  systemPrompt?: string;
  maxHistoryLength?: number;
}

export interface AgentMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface AgentContext {
  config: AgentConfig;
  history: AgentMessage[];
  metadata: Record<string, unknown>;
}

export class AgentEngine {
  private config: AgentConfig;
  private history: AgentMessage[] = [];
  private systemPrompt: string;

  constructor(config: AgentConfig) {
    this.config = config;
    this.systemPrompt = config.systemPrompt || config.persona;
  }

  async send(input: string): Promise<string> {
    this.history.push({
      role: "user",
      content: input,
      timestamp: Date.now(),
    });

    const messages: ChatMessage[] = [
      { role: "system", content: this.systemPrompt },
      ...this.history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const result: CompletionResult = await this.config.router.complete(messages);

    this.history.push({
      role: "assistant",
      content: result.content,
      timestamp: Date.now(),
    });

    const maxHistory = this.config.maxHistoryLength ?? 100;
    if (this.history.length > maxHistory) {
      this.history = this.history.slice(-maxHistory);
    }

    return result.content;
  }

  getHistory(): AgentMessage[] {
    return [...this.history];
  }

  getContext(): AgentContext {
    return {
      config: this.config,
      history: this.getHistory(),
      metadata: {},
    };
  }

  clearHistory(): void {
    this.history = [];
  }
}
