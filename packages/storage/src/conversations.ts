import { randomUUID } from 'node:crypto';
import type { DorsDatabase } from './database.js';
import type { Conversation, StoredMessage } from './types.js';

export class ConversationStore {
  private db: DorsDatabase;

  constructor(db: DorsDatabase) {
    this.db = db;
  }

  create(title?: string, agentName: string = 'dors'): Conversation {
    const id = randomUUID();
    const stmt = this.db.db.prepare(
      'INSERT INTO conversations (id, title, agent_name) VALUES (?, ?, ?)'
    );
    stmt.run(id, title ?? null, agentName);

    return this.get(id)!;
  }

  get(id: string): Conversation | null {
    const stmt = this.db.db.prepare('SELECT * FROM conversations WHERE id = ?');
    const row = stmt.get(id) as Conversation | undefined;
    return row ?? null;
  }

  list(agentName?: string, limit: number = 50): Conversation[] {
    if (agentName) {
      const stmt = this.db.db.prepare(
        'SELECT * FROM conversations WHERE agent_name = ? ORDER BY updated_at DESC LIMIT ?'
      );
      return stmt.all(agentName, limit) as Conversation[];
    }
    const stmt = this.db.db.prepare(
      'SELECT * FROM conversations ORDER BY updated_at DESC LIMIT ?'
    );
    return stmt.all(limit) as Conversation[];
  }

  addMessage(conversationId: string, role: string, content: string): StoredMessage {
    const id = randomUUID();
    const insertMsg = this.db.db.prepare(
      'INSERT INTO messages (id, conversation_id, role, content) VALUES (?, ?, ?, ?)'
    );
    insertMsg.run(id, conversationId, role, content);

    // Update conversation's updated_at
    const updateConvo = this.db.db.prepare(
      "UPDATE conversations SET updated_at = datetime('now') WHERE id = ?"
    );
    updateConvo.run(conversationId);

    const stmt = this.db.db.prepare('SELECT * FROM messages WHERE id = ?');
    return stmt.get(id) as StoredMessage;
  }

  getMessages(conversationId: string): StoredMessage[] {
    const stmt = this.db.db.prepare(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC'
    );
    return stmt.all(conversationId) as StoredMessage[];
  }

  delete(id: string): void {
    const stmt = this.db.db.prepare('DELETE FROM conversations WHERE id = ?');
    stmt.run(id);
  }
}
