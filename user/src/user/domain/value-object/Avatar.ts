import { VOString } from './AVOString.js';


export class Avatar extends VOString {

	private static readonly IMG_EXT_REGEX: RegExp = /\.(png|jpe?g|webp)$/i;

	private constructor(path: string) { super(path); }

	static create(input: unknown): Avatar {
		const v = String(input ?? '').trim();
		if (!v)
			throw new Error("Avatar path is required.");
		if (!Avatar.IMG_EXT_REGEX.test(v))
			throw new Error("Avatar path must be a PNG, JPG or WENP file.");
		return new Avatar(v);
	}

	static fromDb(avatar: string) : Avatar {
		return new Avatar(avatar);
	}
}