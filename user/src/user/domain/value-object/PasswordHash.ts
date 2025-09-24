import { VOString } from './AVOString.js';


export class PasswordHash extends VOString {

	private constructor(v: string) { super(v); }

	static fromHash(hash: unknown): PasswordHash {
		const v = String(hash ?? '').trim();
		if (!v || v.length < 20)
			throw new Error("Invalid password hash.");
		return new PasswordHash(v);
	}

	static fromDb(hash: string) : PasswordHash {
		return new PasswordHash(hash);
	}
	
}