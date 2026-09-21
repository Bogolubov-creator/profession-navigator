CREATE TABLE IF NOT EXISTS plans(id TEXT PRIMARY KEY,title TEXT NOT NULL,duration_days INTEGER NOT NULL CHECK(duration_days BETWEEN 1 AND 3660),description TEXT NOT NULL DEFAULT '',enabled INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS subscriptions(user_id TEXT PRIMARY KEY REFERENCES users(id),plan_id TEXT NOT NULL REFERENCES plans(id),starts_at INTEGER NOT NULL,ends_at INTEGER NOT NULL,status TEXT NOT NULL CHECK(status IN ('active','revoked')),reason TEXT NOT NULL,updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS access_requests(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),plan_id TEXT NOT NULL REFERENCES plans(id),status TEXT NOT NULL DEFAULT 'pending',created_at INTEGER NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS pending_access_request ON access_requests(user_id) WHERE status='pending';
CREATE TABLE IF NOT EXISTS privacy_requests(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),kind TEXT NOT NULL CHECK(kind IN ('access','correction','deletion')),message TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'pending',response TEXT NOT NULL DEFAULT '',created_at INTEGER NOT NULL,resolved_at INTEGER);
CREATE TABLE IF NOT EXISTS account_audit(id INTEGER PRIMARY KEY,actor_id TEXT NOT NULL,action TEXT NOT NULL,target_id TEXT NOT NULL,created_at INTEGER NOT NULL,details TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS operator_settings(id INTEGER PRIMARY KEY CHECK(id=1),data TEXT NOT NULL);
INSERT OR IGNORE INTO plans VALUES('personal','Личный доступ',30,'Материалы с доступом по подписке',1);
