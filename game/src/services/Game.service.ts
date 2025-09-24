import { dbAll, dbGet, dbRun } from "../database.js";
import { GameRoom } from "../game_server/GameRoom.class.js";

export class GameService {
	static async saveGame(room: GameRoom) {
		const { game } = room;
		const state = game.getState();
		const result = await dbRun(
			`
      INSERT INTO matches (
        tournament_id, player1_id, player2_id,
        score1, score2, winner_id, started_at, ended_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				room.tournamentId ?? null,
				room.registeredPlayerList.find((p) => p.localId == 1),
				room.registeredPlayerList.find((p) => p.localId == 2),
				state.player1.score,
				state.player2.score,
				game.winner ?? null,
				game.startedAt ?? null,
				game.endedAt ?? null,
			]
		);
		return result.lastID;
	}
	//<{ id: number; tournament_id: number; player1_id: number; player2_id: number }>
	static async getPlayerHistory(userId: number) {
		return dbAll(
			`
      SELECT id, tournament_id, player1_id, player2_id, 
             score1, score2, winner_id, started_at, ended_at
      FROM matches
      WHERE player1_id = ? OR player2_id = ?
      ORDER BY started_at DESC`,
			[userId, userId]
		);
	}

	static async getById(id: number) {
		return dbGet(`SELECT * FROM matches WHERE id = ?`, [id]);
	}

	static async listAll() {
		return dbAll(`SELECT * FROM matches ORDER BY started_at DESC`);
	}
}
