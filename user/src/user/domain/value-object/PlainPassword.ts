export class PlainPassword {

	private readonly _value: string;

	private static readonly PASSWORD_REGEX: RegExp =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,30}$/;
	private constructor(value: string) { this._value = value; Object.freeze(this); }
	toString(): string { return '[REDACTED]'; }
	toJSON(): string { return '[REDACTED]'; }
	[Symbol.toPrimitive](): string { return '[REDACTED]'; }

	static create(input: unknown): PlainPassword {
		const v = String(input ?? '').trim();
		if (!v)
			throw new Error("Password is required.");
		if (!PlainPassword.PASSWORD_REGEX.test(v))
    		throw new Error('Password must contain at least one lowercase, one uppercase, one digit, one special char, and be 8–30 chars.');
		return new PlainPassword(v);
	}

	get value(): string { return this._value; };

}