import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('user.db', (err) => {
  if (err) {
    console.error("Erreur d'ouverture de la base de données : ", err.message);
  } else {
    console.log("Base de données connectée.");
  }
});

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON");
  db.run(`
	CREATE TABLE IF NOT EXISTS users (
		id_user INTEGER PRIMARY KEY,
		login TEXT UNIQUE,
		email TEXT COLLATE NOCASE UNIQUE,
		passwordHash TEXT NOT NULL,
		display_name TEXT UNIQUE,
		win INTEGER NOT NULL DEFAULT 0,
		loose INTEGER NOT NULL DEFAULT 0,
		avatar TEXT DEFAULT '',
		status TEXT NOT NULL DEFAULT 'online',
		created_at TEXT DEFAULT CURRENT_TIMESTAMP,
		last_seen INTEGER NOT NULL DEFAULT 0
    )
  `);
  db.run(`
	CREATE INDEX IF NOT EXISTS idx_users_status_lastseen
	ON users(status, last_seen)
  `);
  db.run(`
	CREATE TABLE IF NOT EXISTS friends (
		user_id INTEGER NOT NULL,
		friend_id INTEGER NOT NULL,
		PRIMARY KEY (user_id, friend_id),
		FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
		FOREIGN KEY (friend_id) REFERENCES users(id_user) ON DELETE CASCADE,
		CHECK (user_id != friend_id)
	)
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS friend_requests (
		request_id INTEGER PRIMARY KEY,
		user_id INTEGER NOT NULL,
		friend_id INTEGER NOT NULL,
		status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'declined')),
		UNIQUE (user_id, friend_id),
		FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
		FOREIGN KEY (friend_id) REFERENCES users(id_user) ON DELETE CASCADE,
		CHECK (user_id != friend_id)
    )
    `);
  db.run(`
    CREATE TRIGGER IF NOT EXISTS prevent_request_if_already_friends
    BEFORE INSERT ON friend_requests
    FOR EACH ROW
    WHEN EXISTS (
      SELECT 1
      FROM friends
      WHERE (user_id = NEW.user_id AND friend_id = NEW.friend_id)
        OR (user_id = NEW.friend_id AND friend_id = NEW.user_id)
    )
    BEGIN
      SELECT RAISE(ABORT, 'Users are already friends.');
    END;
    `);
  db.run(`
    CREATE TRIGGER IF NOT EXISTS friendship_accepted
    AFTER UPDATE ON friend_requests
    WHEN NEW.status = 'accepted'
    BEGIN
      INSERT INTO friends (user_id, friend_id)
      VALUES (NEW.user_id, NEW.friend_id);
    END;
    `);
  db.run(`
	CREATE TRIGGER IF NOT EXISTS insert_friend_mirror
	AFTER INSERT ON friends
	FOR EACH ROW
	BEGIN
		INSERT OR IGNORE INTO friends (user_id, friend_id)
		VALUES (NEW.friend_id, NEW.user_id);
	END;
	`);
  db.run(`
	CREATE TRIGGER IF NOT EXISTS delete_friend_mirror
	AFTER DELETE ON friends
	FOR EACH ROW
	BEGIN
		DELETE FROM friends
		WHERE user_id = OLD.friend_id and friend_id = OLD.user_id;
	END;
	`);
  db.run(`CREATE TRIGGER IF NOT EXISTS delete_friend_request
	AFTER DELETE ON friends
	FOR EACH ROW
	BEGIN
		DELETE FROM friend_requests
		WHERE (user_id = OLD.user_id AND friend_id = OLD.friend_id)
		OR (user_id = OLD.friend_id AND friend_id = OLD.user_id);
	END;
	`);

  // FOR TEST PURPOSE
  db.all("SELECT COUNT(*) as count FROM users", (err, rows: { count: number }[]) => {
    if (err) {
      console.error("Erreur lors du comptage des utilisateurs :", err.message);
      return;
    }

    const count = rows[0].count;
    if (count === 0) {
      const stmt = db.prepare(`
        INSERT INTO users (login, email, passwordHash, display_name, avatar, status, win, loose)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (let i = 1; i <= 10; i++) {
        stmt.run(
          `user${i}`,
          `user${i}@example.com`,
          `$2b$10$9jmJxpEbzOVVm9GsDSRPn.xnRUblLOwsZyU6wIe/oVKF1KdrEKPg6`,
          `User${i}`,
          '',
          'offline',
          i,
          i
        );
      }

      stmt.finalize();
      console.log("10 utilisateurs de test insérés.");
    } else {
      console.log(`La base contient déjà ${count} utilisateur(s), insertion ignorée.`);
    }
  });
});

export default db;
