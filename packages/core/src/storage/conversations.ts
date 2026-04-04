import type Database from 'better-sqlite3';

export interface Conversation {
  id: string;
  title: string | null;
  persona: string;
  created_at: string;
  updated_at: string;
}

export interface StoredMessage {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  tool_call_id: string | null;
  created_at: string;
}

export class ConversationStore {
  constructor(private db: Database.Database) {}

  create(persona = 'dors', title?: string): Conversation {
    const stmt = this.db.prepare(
      'INSERT INTO conversations (title, persona) VALUES (?, ?) RETURNING *',
    );
    return stmt.get(title ?? null, persona) as Conversation;
  }

  get(id: string): Conversation | undefined {
    return this.db.prepare('SELECT * FROM conversations WHERE id = ?').get(id) as Conversation | undefined;
  }

  list(limit = 20): Conversation[] {
    return this.db
      .prepare('SELECT * FROM conversations ORDER BY updated_at DESC LIMIT ?')
      .all(limit) as Conversation[];
  }

  addMessage(conversationId: string, role: string, content: string, toolCallId?: string): StoredMessage {
    const stmt = this.db.prepare(
      'INSERT INTO messages (conversation_id, role, content, tool_call_id) VALUES (?, ?, ?, ?) RETURNING *',
    );
    const msg = stmt.get(conversationId, role, content, toolCallId ?? null) as StoredMessage;

    this.db.prepare('UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(conversationId);

    return msg;
  }

  getMessages(conversationId: string, limit = 100): StoredMessage[] {
    return this.db
      .prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT ?')
      .all(conversationId, limit) as StoredMessage[];
  }

  delete(id: string): void {
    this.db.prepare('DELETE FROM messages WHERE conversation_id = ?').run(id);
    this.db.prepare('DELETE FROM conversations WHERE id = ?').run(id);
  }
}
