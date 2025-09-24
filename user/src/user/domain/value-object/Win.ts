import { VOInt } from "./AVOInt.js";

export class Win extends VOInt {

	private constructor(v: number) { super(v); }
	
	static create(input: unknown): Win {
		const n = Number(input);
		if (!Number.isInteger(n) || n < 0 || !Number.isSafeInteger(n))
			throw new Error("Invalid win count.");
		return new Win(n);
	}

	static fromDb(count: number) : Win {
		return new Win(count);
	}

	static default(): Win { return new Win(0); }
}