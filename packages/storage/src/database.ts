import Database from 'better-sqlite3';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATION_PATH = resolve(__dirname, 'migrations', '001_init.sql');

export class DorsDatabase {
  public db: Database.Database;
  private dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
    this.db = null!;
  }

  init(): void {
    // Create parent directory if needed (skip for in-memory)
    if (this.dbPath !== ':memory:') {
      const dir = dirname(this.dbPath);
      mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(this.dbPath);

    // Enable WAL mode for better concurrent performance
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');

    // Run migration
    let sql: string;
    try {
      sql = readFileSync(MIGRATION_PATH, 'utf-8');
    } catch {
      // Fallback: inline migration for when running from dist or tests
      sql = `
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  title TEXT,
  agent_name TEXT NOT NULL DEFAULT 'dors',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS memory (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  agent_name TEXT NOT NULL DEFAULT 'dors',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(key, agent_name)
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_memory_agent ON memory(agent_name);
CREATE INDEX IF NOT EXISTS idx_memory_key ON memory(key, agent_name);
      `;
    }

    this.db.exec(sql);
  }

  close(): void {
    if (this.db) {
      this.db.close();
    }
  }
}
