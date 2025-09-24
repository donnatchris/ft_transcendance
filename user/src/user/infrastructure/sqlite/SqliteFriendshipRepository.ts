import { IFriendshipRepository, IFriendRow } from "../../domain/IFriendshipRepository.js";
import { UserId } from "../../domain/value-object/UserId.js";
import { dbGet, dbRun, dbAll } from "../../utils/dbUtils.js";


export class SqliteFriendshipRepository implements IFriendshipRepository {

	async listFriends(userId: UserId): Promise<IFriendRow[]> {
		const query =	`SELECT u.id_user, u.login, u.display_name, u.avatar, u.status, u.win, u.loose
						FROM friends f
						JOIN users u ON u.id_user = f.friend_id
						WHERE f.user_id = ?
						ORDER BY u.display_name COLLATE NOCASE ASC`;
		const params = [userId.value];
		const rows: IFriendRow[] = await dbAll(query, params);
		let statsArray: Array<{ id_user: number; wins: number; losses: number }>;
		try {
			statsArray = await this.fetchAllPlayersWinsAndLosses();
		} catch (e) {
			console.error("[USER: SqliteFriendshipRepository] listFriend could not fetch global stats:", e);
			return rows;
		}
		const statsById = new Map<number, { wins: number; losses: number }>(
			statsArray.map(s => [s.id_user, { wins: s.wins, losses: s.losses }])
		);
		for (const friend of rows) {
			const s = statsById.get(friend.id_user);
			if (s) {
				friend.win = s.wins;
				friend.loose = s.losses;
			} else {
				friend.win = 0;
				friend.loose = 0;
			}
		}
		return rows;
	}

	private async fetchAllPlayersWinsAndLosses(): Promise<Array<{ id_user: number; display_name: string; wins: number; losses: number }>> {
		const res = await fetch("/gate/game/tournament/allPlayersWinsAndLosses", {
			method: "GET",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			credentials: "include",
		});
		if (!res.ok) {
			throw new Error(`[stats] HTTP ${res.status}`);
		}
		return res.json();
	}

	async listPendingReceived(userId: UserId): Promise<any> {
		const query =	`SELECT fr.request_id, u.id_user, u.display_name, u.avatar
						FROM friend_requests fr
						JOIN users u ON u.id_user = fr.user_id
						WHERE fr.friend_id = ?
							AND fr.status = 'pending'
						ORDER BY u.display_name COLLATE NOCASE ASC`;
		const params = [userId.value];
		const rows = await dbAll(query, params);
		return rows;
	}

	async listPendingSent(userId: UserId): Promise<any> {
		const query =	`SELECT fr.request_id, u.id_user, u.display_name, u.avatar, fr.status
 						FROM friend_requests fr
 						JOIN users u ON u.id_user = fr.friend_id
 						WHERE fr.user_id = ?
 							AND fr.status IN ('pending', 'declined')
 						ORDER BY (fr.status != 'pending') ASC,
 							u.display_name COLLATE NOCASE ASC`;
		const params = [userId.value];
		const rows = await dbAll(query, params);
		return rows;
	}

	async listAddablePeople(userId: UserId): Promise<UserId[]> {
		const query = `SELECT u.id_user FROM users u
                        WHERE u.id_user != ?
                        AND NOT EXISTS (
                            SELECT 1
                            FROM friends f
                            WHERE (f.user_id = ? AND f.friend_id = u.id_user)
                            OR (f.friend_id = ? AND f.user_id = u.id_user)
                        )
                        AND NOT EXISTS (
                            SELECT 1
                            FROM friend_requests fr
                            WHERE fr.status = 'pending'
                            AND fr.user_id = ?
                            AND fr.friend_id = u.id_user
                        )
                        ORDER BY u.display_name COLLATE NOCASE ASC;`;
		const params = [userId.value, userId.value, userId.value, userId.value];
		const rows = await dbAll(query, params);
		return rows.map(r => UserId.fromDb(r.id_user));
	}

	async areFriends(a: UserId, b: UserId): Promise<boolean> {
		const query = `SELECT * FROM friends WHERE user_id = ? AND friend_id = ?`
		const params = [a.value, b.value];
		const res = await dbGet(query, params);
		return !!res;
	}

	async sendFriendRequest(a: UserId, b: UserId): Promise<void> {
		const query = `INSERT INTO friend_requests (user_id, friend_id) VALUES (?, ?)`;
		const params = [a.value, b.value];
		await dbRun(query, params);
	}

	async answerFriendRequest(userId: UserId, p: { friendRequest: number, answer: 'accepted' | 'declined' }): Promise<void> {
		const query = 	`UPDATE friend_requests
						SET status = ?
						WHERE request_id = ?
							AND friend_id = ?
							AND status = 'pending'`;
		const params = [p.answer, p.friendRequest.toString(), userId.value];
		await dbRun(query, params);
	}

	async removeFriendship(a: UserId, b: UserId): Promise<void> {
		const query = `DELETE FROM friends WHERE user_id = ? AND friend_id = ?`;
		const params = [a.value, b.value];
		await dbRun(query, params);
	}

}
