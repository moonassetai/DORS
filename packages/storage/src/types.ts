export interface Conversation {
  id: string;
  title: string | null;
  agent_name: string;
  created_at: string;
  updated_at: string;
}

export interface StoredMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface MemoryEntry {
  id: string;
  key: string;
  value: string;
  category: string;
  agent_name: string;
  created_at: string;
  updated_at: string;
}
