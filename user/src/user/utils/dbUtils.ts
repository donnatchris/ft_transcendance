import db from '../../database.js';
import { UserStatus } from '../../const/const.js';


export function dbRun(sql: string, params: any[]): Promise<{ lastID: number }> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err: any) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID });
    });
  });
}


export function dbGet(sql: string, params: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}


export function dbAll(sql: string, params: any[]): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}


export async function changeStatus(userId: number, newStatus: UserStatus) {
	const query = `
		UPDATE users
		SET status = ?
		WHERE id_user = ?`;
	try {
		await dbRun(query, [newStatus, userId]);
		console.log("[User dbUtils] User status has been changed.");
		return true;
	}
	catch (error) {
		console.log("[User dbUtils] Failed to change user status.");
		return false;
	}
}


export async function getStatus(userId: number): Promise<string> {
	const query = `SELECT status FROM users WHERE id_user = ?`;
	try {
		const row = await dbGet(query, [userId]);
		return row?.status ?? "unknown";
	}
	catch (error) {
		console.log(`[User dbUtils] Failed to get status from user #${userId}`);
		return "unknown";
	}
}


export async function getValueFrom(userId: number, value: string): Promise<any> {
	const allowedValues = ['login', 'display_name', 'avatar', 'password', 'status', 'email', 'win', 'loose'];
	if (!allowedValues.includes(value)) {
		console.log(`[User dbUtils] ${value} is not a valid value in users table.`);
		return "unknown";
	}
	const query = `SELECT ${value} FROM users WHERE id_user = ?`;
	try {
		const row = await dbGet(query, [userId]);
		return row?.[value] ?? "unknown";
	}
	catch (error) {
		console.log(`[User dbUtils] Failed to get ${value} from user #${userId}`);
		return "unknown";
	}
}

