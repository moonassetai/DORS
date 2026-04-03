import { randomUUID } from 'node:crypto';
import type { DorsDatabase } from './database.js';
import type { MemoryEntry } from './types.js';

export class MemoryStore {
  private db: DorsDatabase;

  constructor(db: DorsDatabase) {
    this.db = db;
  }

  set(key: string, value: string, category: string = 'general', agentName: string = 'dors'): void {
    const existing = this.db.db
      .prepare('SELECT id FROM memory WHERE key = ? AND agent_name = ?')
      .get(key, agentName) as { id: string } | undefined;

    if (existing) {
      this.db.db
        .prepare("UPDATE memory SET value = ?, category = ?, updated_at = datetime('now') WHERE id = ?")
        .run(value, category, existing.id);
    } else {
      const id = randomUUID();
      this.db.db
        .prepare('INSERT INTO memory (id, key, value, category, agent_name) VALUES (?, ?, ?, ?, ?)')
        .run(id, key, value, category, agentName);
    }
  }

  get(key: string, agentName: string = 'dors'): string | null {
    const row = this.db.db
      .prepare('SELECT value FROM memory WHERE key = ? AND agent_name = ?')
      .get(key, agentName) as { value: string } | undefined;
    return row?.value ?? null;
  }

  list(agentName?: string, category?: string): MemoryEntry[] {
    if (agentName && category) {
      return this.db.db
        .prepare('SELECT * FROM memory WHERE agent_name = ? AND category = ? ORDER BY updated_at DESC')
        .all(agentName, category) as MemoryEntry[];
    }
    if (agentName) {
      return this.db.db
        .prepare('SELECT * FROM memory WHERE agent_name = ? ORDER BY updated_at DESC')
        .all(agentName) as MemoryEntry[];
    }
    if (category) {
      return this.db.db
        .prepare('SELECT * FROM memory WHERE category = ? ORDER BY updated_at DESC')
        .all(category) as MemoryEntry[];
    }
    return this.db.db
      .prepare('SELECT * FROM memory ORDER BY updated_at DESC')
      .all() as MemoryEntry[];
  }

  delete(key: string, agentName: string = 'dors'): void {
    this.db.db
      .prepare('DELETE FROM memory WHERE key = ? AND agent_name = ?')
      .run(key, agentName);
  }

  search(query: string, agentName: string = 'dors'): MemoryEntry[] {
    const pattern = `%${query}%`;
    return this.db.db
      .prepare(
        'SELECT * FROM memory WHERE agent_name = ? AND (key LIKE ? OR value LIKE ?) ORDER BY updated_at DESC'
      )
      .all(agentName, pattern, pattern) as MemoryEntry[];
  }
}
