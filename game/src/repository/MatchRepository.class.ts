import db from "../database.js";
import Match from "../game_server/chris/Match.class.js";
import { Tournament } from "../game_server/chris/Tournament.class.js";
import { IMatchRepository } from "../game_server/chris/IMatchRepository.js";

export interface MatchHistory {
  id: number;
  tournament_id: string | null;
  player1_id: number | null;
  player1_display_name: string;
  score1: number;
  player2_id: number | null;
  player2_display_name: string;
  score2: number;
  winner_id: number | null;
  status: string;
  started_at: string | null;
  ended_at: string | null;
  winner_name?: string;
  tournament_name?: string;
}

export interface PlayerStats {
  wins: number;
  losses: number;
}

export class MatchRepository implements IMatchRepository {

  async tournamentExists(name: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		try {
			const query = `SELECT COUNT(*) as count FROM tournaments WHERE tournament_name = ?`;
			db.get(query, [name], (err: any, row: any) => {
			  if (err) return reject(err);
			  resolve(row.count > 0);
			});
		} catch {
			resolve(false);
		}
	});
  }

  async saveTournamentCreation(tournament: Tournament): Promise<void> {
	return new Promise((resolve, reject) => {
	  const query = `
		INSERT INTO tournaments (tournament_name, created_by, status, started_at)
		VALUES (?, ?, ?, datetime('now'))
	  `;
	  db.run(
		query,
		[tournament.name, tournament.created_by?.id ?? null, tournament.status || "locked"],
		(err) => {
		  if (err) return reject(err);
		  resolve();
		}
	  );
	});
  }

  async saveTournamentEnd(tournament: Tournament): Promise<void> {
	return new Promise((resolve, reject) => {
	  const query = `
		UPDATE tournaments
		SET status = 'done', ended_at = datetime('now'), winner_id = ?, winner_display_name = ?
		WHERE tournament_name = ?
	  `;
	  db.run(query, [tournament.winner?.id, tournament.winner?.display_name, tournament.name], (err) => {
		if (err) return reject(err);
		resolve();
	  });
	});
  }

  async saveMatchRaw(data:{players:[number,number], scores:[number,number], winner:number | null}): Promise<void> {
	const player1_display_name = await this.getDisplayName(data.players[0]);
	const player2_display_name = await this.getDisplayName(data.players[1]);
	return new Promise((resolve, reject) => {
	  const query = `
		INSERT INTO matches (
		  tournament_name, player1_id, player1_display_name, score1, player2_id, player2_display_name, score2,
		  winner_id, winner_display_name, status, started_at, ended_at
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	  `;

	  const tournamentName = null;
	  const player1Id = data.players[0];
	  const score1 = data.scores[0];
	  const player2Id = data.players[1]
	  const score2 = data.scores[1];
	  const winnerId = data.winner;
	  const winner_display_name = null;
	  const status = "done";
	  const startedAt =  null;
	  const endedAt =  null;

	  db.run(
		query,
		[tournamentName, player1Id, player1_display_name, score1, player2Id, player2_display_name, score2, winnerId, winner_display_name, status, startedAt, endedAt],
		(err) => {
		  if (err) return reject(err);
		  resolve();
		}
	  );
	});
  }

    private async getDisplayName(id: number | null): Promise<string | null> {
	if (!id) {
		return '[unknown]';
	}
	if (id < 1) {
		return '[IA]';
	}
	const res = await fetch('https://user:3001/find_user_by_id', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ id: id })
	});
    if (!res.ok) {
      console.error(`[Game: getDisplayName] HTTP error ${res.status}`);
      return null;
    }
    const data = await res.json();
    if (!data || !data.success || !data.user) {
      console.warn("[Game: getDisplayName] no user found for id", id);
      return '[unknown]';
    }
	const user = data.user;
	return user?.display_name || '[unknown]';
  }


  async saveMatch(match: Match): Promise<void> {
	return new Promise((resolve, reject) => {
	  const query = `
		INSERT INTO matches (
		  tournament_name, player1_id, player1_display_name, score1, player2_id, player2_display_name, score2,
		  winner_id, winner_display_name, status, started_at, ended_at
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	  `;

	  const tournamentName = match.tournament?.name ?? null;
	  const player1Id = match.playerArray[0]?.player.id ?? null;
	  let player1_display_name: string | null = match.playerArray[0]?.player.display_name ?? null;
	  const score1 = match.playerArray[0]?.score ?? 0;
	  const player2Id = match.playerArray[1]?.player.id ?? null;
	  let player2_display_name: string | null = match.playerArray[1]?.player.display_name ?? null;
	  const score2 = match.playerArray[1]?.score ?? 0;
	  const winnerId = match.winner?.id ?? null;
	  const winner_display_name = match.winner?.display_name ?? null;
	  const status = match.status;
	  const startedAt = match.started_at?.toISOString() ?? null;
	  const endedAt = match.ended_at?.toISOString() ?? null;

	  db.run(
		query,
		[tournamentName, player1Id, player1_display_name, score1, player2Id, player2_display_name, score2, winnerId, winner_display_name, status, startedAt, endedAt],
		(err) => {
		  if (err) return reject(err);
		  resolve();
		}
	  );
	});
  }

  async getMatchHistoryByTournament(tournamentName: string): Promise<MatchHistory[]> {
	return new Promise((resolve, reject) => {
	  const query = `
		SELECT m.*, 
			   p1.display_name as player1_name, 
			   p2.display_name as player2_name, 
			   w.display_name as winner_name
		FROM matches m
		LEFT JOIN users p1 ON m.player1_id = p1.id
		LEFT JOIN users p2 ON m.player2_id = p2.id
		LEFT JOIN users w ON m.winner_id = w.id
		WHERE m.tournament_id = ?
		ORDER BY m.started_at ASC
	  `;
	  db.all(query, [tournamentName], (err, rows) => {
		if (err) return reject(err);
		resolve(rows as MatchHistory[]);
	  });
	});
  }

  async getMatchHistoryByPlayer(playerId: number): Promise<MatchHistory[]> {
	return new Promise((resolve, reject) => {
	  const query = `
		SELECT m.* FROM matches m
		WHERE m.player1_id = ? OR m.player2_id = ?
		ORDER BY m.started_at ASC
	  `;
	  db.all(query, [playerId, playerId], (err, rows) => {
		if (err) return reject(err);
		resolve(rows as MatchHistory[]);
		});
	});
  }

  async getPlayerTournamentStats(playerId: number, tournamentName: string): Promise<PlayerStats> {
  	return new Promise((resolve, reject) => {
   	 const query = `
      SELECT 
        SUM(CASE WHEN m.winner_id = ? THEN 1 ELSE 0 END) AS wins,
        SUM(CASE WHEN (m.player1_id = ? OR m.player2_id = ?) AND m.winner_id != ? THEN 1 ELSE 0 END) AS losses
      FROM matches m
      WHERE m.tournament_id = ?
    `;
    db.get<{ wins: number; losses: number }>(query, [playerId, playerId, playerId, playerId, tournamentName], (err, row) => {
      if (err) return reject(err);
      const stats: PlayerStats = {
        wins: row?.wins ?? 0,
        losses: row?.losses ?? 0,
      };
      resolve(stats);
    });
  });
}

  async getPlayerNonTournamentStats(playerId: number): Promise<PlayerStats> {
    return new Promise((resolve, reject) => {
      const query = `
		SELECT 
        SUM(CASE WHEN m.winner_id = ? THEN 1 ELSE 0 END) AS wins,
        SUM(CASE WHEN (m.player1_id = ? OR m.player2_id = ?) AND m.winner_id != ? THEN 1 ELSE 0 END) AS losses
      FROM matches m
      WHERE m.tournament_id IS NULL
      `;
      db.get<{ wins: number; losses: number }>(query, [playerId, playerId, playerId, playerId], (err, row) => {
      if (err) return reject(err);
      const stats: PlayerStats = {
        wins: row?.wins ?? 0,
        losses: row?.losses ?? 0,
      };
      resolve(stats);
      });
    });
  }

  async getPlayerWinsAndLosses(id_player: number): Promise<{ wins: number; losses: number }> {
	return new Promise((resolve, reject) => {
	  const query = `
		SELECT
		  SUM(CASE WHEN m.winner_id = ? THEN 1 ELSE 0 END) AS wins,
		  SUM(CASE WHEN (m.player1_id = ? OR m.player2_id = ?) AND m.winner_id != ? THEN 1 ELSE 0 END) AS losses
		FROM matches m
	  `;
	  db.get<{ wins: number; losses: number }>(query, [id_player, id_player, id_player, id_player], (err, row) => {
		if (err) return reject(err);
		resolve({ wins: row?.wins ?? 0, losses: row?.losses ?? 0 });
	  });
	});
  }

  async getAllPlayersWinsAndLosses(): Promise<{ id_user: number; display_name: string; wins: number; losses: number }[]> {
	return new Promise((resolve, reject) => {
	  const query = `
		SELECT
		  u.id_user,
		  u.display_name,
		  COALESCE(SUM(CASE WHEN m.winner_id = u.id_user THEN 1 ELSE 0 END), 0) AS wins,
		  COALESCE(SUM(CASE WHEN (m.player1_id = u.id_user OR m.player2_id = u.id_user) AND m.winner_id != u.id_user THEN 1 ELSE 0 END), 0) AS losses
		FROM users u
		LEFT JOIN matches m ON u.id_user = m.player1_id OR u.id_user = m.player2_id
		GROUP BY u.id_user, u.display_name
		ORDER BY wins DESC, losses ASC
	  `;
	  db.all<{ id_user: number; display_name: string; wins: number; losses: number }>(query, [], (err, rows) => {
		if (err) return reject(err);
		resolve(rows);
	  });
	});
  }

}
