export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface StreamChunk {
  content: string;
  done: boolean;
}

export interface ChatResponse {
  content: string;
  model: string;
  provider: string;
  tokensUsed: { input: number; output: number };
  latencyMs: number;
}

export interface LLMProvider {
  name: string;
  chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse>;
  stream(messages: Message[], options?: ChatOptions): AsyncIterable<StreamChunk>;
  isAvailable(): Promise<boolean>;
}
