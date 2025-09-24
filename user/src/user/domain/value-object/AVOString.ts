export abstract class VOString {

	protected readonly _value: string;

	protected constructor (value: string) { this._value = value; Object.freeze(this); } 
	get value():string { return this._value; }
	toString(): string { return this._value; }
	toJSON(): string { return this._value; }
	[Symbol.toPrimitive]() { return this._value; }
	equals(other: this) { return this._value === other._value; }

}