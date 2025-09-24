import { dbRun, dbAll, dbGet } from "../database.js";

export interface Tournament {
	id: number;
	name: string;
	created_by: number;
}

export interface TournamentPlayer {
	id: number;
	username: string;
}

class TournamentService {
	static async createTournament(name: string, createdBy: number) {
		const { lastID } = await dbRun(`INSERT INTO tournaments (name, created_by) VALUES (?, ?)`, [name, createdBy]);
		return { id: lastID, name, createdBy };
	}

	static async registerPlayer(tournamentId: number, userId: number) {
		await dbRun(`INSERT INTO tournaments_participants (tournament_id, user_id) VALUES (?, ?)`, [tournamentId, userId]);
		return { message: "Joueur inscrit", tournamentId, userId };
	}

	static async listPlayers(tournamentId: number): Promise<TournamentPlayer[]> {
		return await dbAll<TournamentPlayer>(
			`SELECT u.id, u.username
       FROM tournaments_participants tp
       JOIN users u ON tp.user_id = u.id
       WHERE tp.tournament_id = ?`,
			[tournamentId]
		);
	}

	static async startTournament(tournamentId: number) {
		const rows = await dbAll<{ user_id: number }>(`SELECT user_id FROM tournaments_participants WHERE tournament_id = ?`, [tournamentId]);

		let players = rows.map((r) => r.user_id);

		// Si nombre impair, on ajoute un bot (id = 0)
		if (players.length % 2 !== 0) {
			players.push(0);
		}

		// Shuffle (Fisher–Yates)
		for (let i = players.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[players[i], players[j]] = [players[j], players[i]];
		}

		// Construire query batch
		const placeholders = players
			.reduce((acc, _, idx) => {
				if (idx % 2 === 0) acc.push("(?, ?, ?)");
				return acc;
			}, [] as string[])
			.join(",");

		const values: any[] = [];
		for (let i = 0; i < players.length; i += 2) {
			values.push(tournamentId, players[i], players[i + 1]);
		}

		await dbRun(`INSERT INTO matches (tournament_id, player1_id, player2_id) VALUES ${placeholders}`, values);

		return { message: "Tournoi lancé", matchCount: players.length / 2 };
	}

	/**
	 * Récupérer un tournoi par ID
	 */
	static async getTournament(id: number): Promise<Tournament | undefined> {
		return await dbGet<Tournament>(`SELECT id, name, created_by FROM tournaments WHERE id = ?`, [id]);
	}
}

export default TournamentService;
