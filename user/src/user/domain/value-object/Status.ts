import { VOString } from './AVOString.js';


export type UserStatusType = 'online' | 'offline' | 'in game';
function isStatusType(v: string): v is UserStatusType {
	return ['online', 'offline', 'in game'].includes(v);
}


export class UserStatus extends VOString {

	private constructor(value: UserStatusType) {
		super(value);
	}

	static create(input: unknown): UserStatus {
		const v = String(input ?? '').toLowerCase().trim();
		if (!v)
			throw new Error("UserStatus is required.");
		if (!isStatusType(v))
			throw new Error('UserStatus must be one of: online, offline, in game.');
		return new UserStatus(v);
	}
	static offline(): UserStatus { return new UserStatus('offline'); }
	static online(): UserStatus { return new UserStatus('online'); }
	static inGame(): UserStatus { return new UserStatus('in game'); }

	get value(): UserStatusType { return this._value as UserStatusType; };

	isOnline(): boolean { return this._value === 'online'; }
	isOffline(): boolean { return this._value === 'offline'; }
	isInGame(): boolean { return this._value === 'in game'; }

	static fromDb(status: string) : UserStatus {
		return new UserStatus(status as UserStatusType);
	}
	
}