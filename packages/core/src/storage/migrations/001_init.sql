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
