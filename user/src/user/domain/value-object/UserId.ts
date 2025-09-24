import { VOInt } from "./AVOInt.js";
export class UserId extends VOInt {

	private constructor(v: number) { super(v); }
	
	static create(input: unknown): UserId {
		const n = Number(input);
		if (!Number.isInteger(n) || n <= 0 || !Number.isSafeInteger(n))
			throw new Error("Invalid user id.");
		return new UserId(n);
	}

	static newTemporary(): UserId { return new UserId(0); }

	isTemporary(): boolean { return this._value === 0; }

	static fromDb(id: number) : UserId {
		return new UserId(id);
	}
}
