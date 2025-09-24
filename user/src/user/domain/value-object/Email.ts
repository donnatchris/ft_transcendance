import { VOString } from './AVOString.js';


export class Email extends VOString {

	private static readonly EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	private constructor(v: string) { super(v); }

	static create(input: unknown): Email {
		const v = String(input ?? '').trim().toLowerCase();
		if (!v)
			throw new Error("Email is required.");
		if (v.length > 254)
			throw new Error('Email too long.');
		if (!Email.EMAIL_REGEX.test(v))
			throw new Error("Invalid email format.");
		return new Email(v);
	}

	static fromDb(email: string) : Email {
		return new Email(email);
	}
	
}