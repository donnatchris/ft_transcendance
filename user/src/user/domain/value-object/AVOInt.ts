export class VOInt {
	protected readonly _value: number;

	protected constructor(value: number) {
		this._value = value;
		Object.freeze(this);
	}

	get value(): number { return this._value; }

	toString(): string { return this._value.toString(); }
	toJSON(): number { return this._value; }
	[Symbol.toPrimitive](): number { return this._value; }
	equals(other: this): boolean { return this._value === other._value; }

}