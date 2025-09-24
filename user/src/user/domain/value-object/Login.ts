import { VOString } from './AVOString.js';


export class Login extends VOString {

	private static readonly LOGIN_REGEX: RegExp = /^[a-zA-Z0-9_]{3,20}$/;

	private constructor(v: string) { super(v); }

	static create(input: unknown): Login {
		const v = String(input ?? '').trim();
		if (!v)
			throw new Error("Login is required.");
		if (!Login.LOGIN_REGEX.test(v))
			throw new Error("Login must be 3-20 chars: letters, digits, underscore only.");
		return new Login(v);
	}

	static fromDb(login: string) : Login {
		return new Login(login);
	}
	
}