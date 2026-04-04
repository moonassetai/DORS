import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function createDatabase(dbPath: string): Database.Database {
  const dir = dirname(dbPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  runMigrations(db);

  return db;
}

function runMigrations(db: Database.Database): void {
  const migrationPath = join(__dirname, '..', '..', 'src', 'storage', 'migrations', '001_init.sql');

  // Try bundled path first, then source path
  let sql: string;
  try {
    sql = readFileSync(migrationPath, 'utf-8');
  } catch {
    // When running from dist, try relative to current file
    const altPath = join(__dirname, 'migrations', '001_init.sql');
    try {
      sql = readFileSync(altPath, 'utf-8');
    } catch {
      // Inline migration as fallback
      sql = `
        CREATE TABLE IF NOT EXISTS conversations (
          id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
          title TEXT,
          persona TEXT DEFAULT 'dors',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
          conversation_id TEXT NOT NULL REFERENCES conversations(id),
          role TEXT NOT NULL CHECK(role IN ('system','user','assistant','tool')),
          content TEXT NOT NULL,
          tool_call_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS memory (
          id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
          key TEXT NOT NULL UNIQUE,
          value TEXT NOT NULL,
          category TEXT DEFAULT 'general',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
        CREATE INDEX IF NOT EXISTS idx_memory_category ON memory(category);
      `;
    }
  }

  db.exec(sql);
}
