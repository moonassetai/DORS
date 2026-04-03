export interface StorageConfig {
  driver: "sqlite" | "memory";
  path?: string;
}

export interface ConversationRecord {
  id: string;
  agentName: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: number;
  }>;
  createdAt: number;
  updatedAt: number;
}

export interface MemoryRecord {
  id: string;
  agentName: string;
  key: string;
  value: string;
  createdAt: number;
  updatedAt: number;
}

export interface StorageDriver {
  init(): Promise<void>;
  saveConversation(record: ConversationRecord): Promise<void>;
  getConversation(id: string): Promise<ConversationRecord | null>;
  listConversations(agentName: string): Promise<ConversationRecord[]>;
  saveMemory(record: MemoryRecord): Promise<void>;
  getMemory(agentName: string, key: string): Promise<MemoryRecord | null>;
  listMemories(agentName: string): Promise<MemoryRecord[]>;
  close(): Promise<void>;
}

export class MemoryStorage implements StorageDriver {
  private conversations = new Map<string, ConversationRecord>();
  private memories = new Map<string, MemoryRecord>();

  async init() {}

  async saveConversation(record: ConversationRecord) {
    this.conversations.set(record.id, record);
  }

  async getConversation(id: string) {
    return this.conversations.get(id) ?? null;
  }

  async listConversations(agentName: string) {
    return [...this.conversations.values()].filter(
      (c) => c.agentName === agentName
    );
  }

  async saveMemory(record: MemoryRecord) {
    this.memories.set(`${record.agentName}:${record.key}`, record);
  }

  async getMemory(agentName: string, key: string) {
    return this.memories.get(`${agentName}:${key}`) ?? null;
  }

  async listMemories(agentName: string) {
    return [...this.memories.values()].filter(
      (m) => m.agentName === agentName
    );
  }

  async close() {
    this.conversations.clear();
    this.memories.clear();
  }
}

export function createStorage(config: StorageConfig): StorageDriver {
  switch (config.driver) {
    case "memory":
      return new MemoryStorage();
    case "sqlite":
      // SQLite driver will be implemented when better-sqlite3 is available
      // For now, fall back to memory storage with a warning
      console.warn(
        `[dors/storage] SQLite driver requested but using in-memory fallback. Path: ${config.path}`
      );
      return new MemoryStorage();
    default:
      throw new Error(`Unknown storage driver: ${config.driver}`);
  }
}
