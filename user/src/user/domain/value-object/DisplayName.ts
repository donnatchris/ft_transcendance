import { VOString } from './AVOString.js';


export class DisplayName extends VOString {

	private static readonly DISPLAY_NAME_REGEX: RegExp = /^[\p{L}\p{N} ._-]{3,32}$/u;

	private constructor(v: string) { super(v); }

	static create(input: unknown): DisplayName {
		const v = String(input ?? '').trim();
		if (!v)
			throw new Error("Display Name is required.");
		if (!DisplayName.DISPLAY_NAME_REGEX.test(v))
			throw new Error("Display Name must be 3-32 chars: letters (incl. accents), digits, space, dot, underscore, hyphen.");
		return new DisplayName(v);
	}

	static fromDb(name: string) : DisplayName {
		return new DisplayName(name);
	}

}