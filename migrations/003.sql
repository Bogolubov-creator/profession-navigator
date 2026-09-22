CREATE TABLE IF NOT EXISTS legal_questions (
 id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 profession TEXT NOT NULL, title TEXT NOT NULL, question TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'new', response TEXT NOT NULL DEFAULT '',
 revision INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL,
 answered_by TEXT, answered_at INTEGER
);
CREATE INDEX IF NOT EXISTS legal_questions_user ON legal_questions(user_id,created_at);
CREATE INDEX IF NOT EXISTS legal_questions_queue ON legal_questions(status,profession);
