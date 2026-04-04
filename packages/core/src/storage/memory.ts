import type Database from 'better-sqlite3';

export interface MemoryEntry {
  id: string;
  key: string;
  value: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export class MemoryStore {
  constructor(private db: Database.Database) {}

  set(key: string, value: string, category = 'general'): MemoryEntry {
    const stmt = this.db.prepare(`
      INSERT INTO memory (key, value, category)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, category = excluded.category, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `);
    return stmt.get(key, value, category) as MemoryEntry;
  }

  get(key: string): MemoryEntry | undefined {
    return this.db.prepare('SELECT * FROM memory WHERE key = ?').get(key) as MemoryEntry | undefined;
  }

  list(category?: string): MemoryEntry[] {
    if (category) {
      return this.db.prepare('SELECT * FROM memory WHERE category = ? ORDER BY updated_at DESC').all(category) as MemoryEntry[];
    }
    return this.db.prepare('SELECT * FROM memory ORDER BY updated_at DESC').all() as MemoryEntry[];
  }

  delete(key: string): boolean {
    const result = this.db.prepare('DELETE FROM memory WHERE key = ?').run(key);
    return result.changes > 0;
  }

  search(query: string): MemoryEntry[] {
    return this.db
      .prepare('SELECT * FROM memory WHERE key LIKE ? OR value LIKE ? ORDER BY updated_at DESC')
      .all(`%${query}%`, `%${query}%`) as MemoryEntry[];
  }
}
