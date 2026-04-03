export interface AgentConfig {
  name: string;
  persona: string; // raw SOUL.md content
  routerConfig: { defaultProvider: string };
}

export interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
