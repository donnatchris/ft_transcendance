import { IUserRepository } from "../../domain/IUserRepository.js";
import { User } from "../../domain/User.js";
import { UserId } from "../../domain/value-object/UserId.js";
import { Login } from "../../domain/value-object/Login.js";
import { Email } from "../../domain/value-object/Email.js";
import { dbGet, dbRun, dbAll } from "../../utils/dbUtils.js";


export class SqliteUserRepository implements IUserRepository {

	async getAllUsers(): Promise<any> {
		const query =	`SELECT id_user, display_name, avatar, status
						FROM users
						ORDER BY display_name COLLATE NOCASE ASC`;
		const rows = await dbAll(query, []);
		return rows;
	}

	async getNbOnlineUsers(): Promise<any> {
		const query =	`SELECT COUNT(*) as count
						FROM users
						WHERE status = 'online'`;
		const rows = await dbAll(query, []);
		return rows[0]?.count || 0;
	}

	async findById(id: UserId): Promise<User | null> {
		const query = "SELECT * FROM users WHERE id_user = ?";
			const row = await dbGet(query, [id.value]);
			return row ? User.createFromDb(row) : null;
	}

	async findManyByIds(ids: UserId[]): Promise<User[]> {
		if (ids.length === 0) return [];
		const placeholders = ids.map(() => "?").join(",");
		const query = `SELECT * FROM users WHERE id_user IN (${placeholders})`;
		const rows = await dbAll(query, ids.map(id => id.value));
		return rows.map(row => User.createFromDb(row));
	}

	async findByLogin(login: Login): Promise<User | null> {
		const query = "SELECT * FROM users WHERE login = ?";
			const row = await dbGet(query, [login.value]);
			return row ? User.createFromDb(row) : null;
	}

	async findByEmail(email: Email): Promise<User | null> {
		const query = "SELECT * FROM users WHERE email = ?";
			const row = await dbGet(query, [email.value]);
			return row ? User.createFromDb(row) : null;
	}

	async findByIdentifier(identifier: unknown): Promise<User | null> {
		const v = String(identifier ?? "");
		if (!v)
			return null;
		let asEmail: Email | null = null;
		let asLogin: Login | null = null;
		try {
			asEmail = Email.create(v);
		} catch {}
		if (asEmail)
			return this.findByEmail(asEmail);   // email prioritaire
		try {
			asLogin = Login.create(v);
		} catch {}
		if (asLogin)
			return this.findByLogin(asLogin);
		return null;
	}

	async save(u: User): Promise<User> {
		try {
			const query = `INSERT INTO users (login, email, passwordHash, display_name, avatar, win, loose)
			VALUES (?, ?, ?, ?, ?, ?, ?)`;
			const params = [
				u.login.value,
				u.email.value,
				u.passwordHash.value,
				u.display_name.value,
				u.avatar?.value ?? null,
				u.win.value,
				u.loose.value
			];
			const userId = await dbRun(query, params);
			if (!userId) {
				console.error("[SqliteUserRepository: save] Error saving user: no ID returned from db.");
				throw new Error("Failed to obtain inserted id.");
			}
			const finalUser = User.createFromDb({
				id_user: userId.lastID,
				login: u.login.value,
				email: u.email.value,
				passwordHash: u.passwordHash.value,
				display_name: u.display_name.value,
				avatar: u.avatar?.value ?? null,
				status: "online",
				win: u.win.value,
				loose: u.loose.value
			});
			return finalUser;
		} catch (error: any) {
			console.error("[SqliteUserRepository: save] Error saving user:", error);
			if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes("UNIQUE constraint failed")) {
				if (error.message.includes("users.login")) {
					throw new Error("User with this login already exists.");
				} else if (error.message.includes("users.email")) {
					throw new Error("User with this email already exists.");
				} else if (error.message.includes("users.display_name")) {
					throw new Error("User with this display name already exists.");
				}
			}
			throw error;
		}
	}

	async updateProfile(id: UserId, p: { field: string, value: string }): Promise<User | null> {
		console.log(`[User: SqliteUserRepository] updateProfile called.`);
		const query = `UPDATE users SET ${p.field} = ? WHERE id_user = ?`;
		await dbRun(query, [p.value, id.value]);
		return await this.findById(id);
	}

	async delete(id: UserId): Promise<void> {
		const query = `DELETE FROM users WHERE id_user = ?`;
		const params = [id.value];
		await dbRun(query, params);
	}

	async touchOnline(id: UserId): Promise<void> {
		const query =	`UPDATE users
						SET status = 'online', last_seen = strftime('%s', 'now')
						WHERE id_user = ?`;
		const params = [id.value];
		await dbRun(query, params);
	}

	async incrementScore(id: UserId, result: 'win' | 'loose'): Promise<void> {
		if (result !== 'win' && result !== 'loose') {
			throw new Error("Invalid result. Must be 'win' or 'loose'.");
		}
		const query =	`UPDATE users
						SET ${result} = ${result} + 1
						WHERE id_user = ?`;
		const params = [id.value];
		await dbRun(query, params);
	}
	
}
