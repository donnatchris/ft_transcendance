import { VOInt } from "./AVOInt.js";

export class Loose extends VOInt {

	private constructor(v: number) { super(v); }
	
	static create(input: unknown): Loose {
		const n = Number(input);
		if (!Number.isInteger(n) || n < 0 || !Number.isSafeInteger(n))
			throw new Error("Invalid loose count.");
		return new Loose(n);
	}

	static fromDb(count: number) : Loose {
		return new Loose(count);
	}

	static default(): Loose { return new Loose(0); }
}