import sqlite3 from "sqlite3";

const db = new sqlite3.Database("database.db", (err) => {
	if (err) {
		console.error("Error opening the database : ", err.message);
	} else {
		console.log("Database connected.");
	}
});

db.serialize(() => {
	// Tournaments table
	db.run(`
    CREATE TABLE IF NOT EXISTS tournaments (
      tournament_id INTEGER PRIMARY KEY AUTOINCREMENT,
      tournament_name TEXT NOT NULL UNIQUE,
      created_by INTEGER,
      started_at TEXT,
      ended_at TEXT DEFAULT NULL,
      status TEXT DEFAULT 'locked' CHECK(status IN ('locked', 'running', 'done')),
	  winner_id INTEGER DEFAULT NULL,
	  winner_display_name TEXT DEFAULT NULL
    )
  `);

	// Matches table
	db.run(`
    CREATE TABLE IF NOT EXISTS matches (
      match_id INTEGER PRIMARY KEY AUTOINCREMENT,
      tournament_name TEXT DEFAULT NULL,
      player1_id INTEGER DEFAULT NULL,
	  player1_display_name TEXT DEFAULT '',
      score1 INTEGER DEFAULT 0,
      player2_id INTEGER DEFAULT NULL,
	  player2_display_name TEXT DEFAULT '',
      score2 INTEGER DEFAULT 0,
      winner_id INTEGER DEFAULT NULL,
	  winner_display_name TEXT DEFAULT NULL,
      status TEXT DEFAULT 'done' CHECK(status IN ('locked', 'running', 'done')),
      started_at TEXT,
      ended_at TEXT,
      FOREIGN KEY (tournament_name) REFERENCES tournaments(tournament_name) ON DELETE CASCADE
    )
  `);
});

export function dbRun(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
	return new Promise((resolve, reject) => {
		db.run(sql, params, function (err) {
			if (err) reject(err);
			else resolve({ lastID: this.lastID, changes: this.changes });
		});
	});
}

export function dbAll<T = unknown>(sql: string, params: any[] = []): Promise<T[]> {
	return new Promise((resolve, reject) => {
		db.all(sql, params, (err, rows) => {
			if (err) reject(err);
			else resolve(rows as T[]);
		});
	});
}

export function dbGet<T = unknown>(sql: string, params: any[] = []): Promise<T | undefined> {
	return new Promise((resolve, reject) => {
		db.get(sql, params, (err, row) => {
			if (err) reject(err);
			else resolve(row as T);
		});
	});
}

export default db;
