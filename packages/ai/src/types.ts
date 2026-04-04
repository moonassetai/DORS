export interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  toolCallId?: string;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: ToolDefinition[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface StreamChunk {
  type: 'text' | 'tool_call' | 'done' | 'error';
  content?: string;
  toolCall?: { name: string; args: Record<string, unknown> };
  error?: string;
}

export interface LLMProvider {
  name: string;
  chat(messages: Message[], options?: ChatOptions): AsyncIterable<StreamChunk>;
  isAvailable(): Promise<boolean>;
}
