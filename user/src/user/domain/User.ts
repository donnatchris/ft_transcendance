import { DisplayName } from "./value-object/DisplayName.js";
import { Email } from "./value-object/Email.js";
import { Login } from "./value-object/Login.js";
import { PasswordHash } from "./value-object/PasswordHash.js";
import { PlainPassword } from "./value-object/PlainPassword.js";
import { UserId } from "./value-object/UserId.js";
import { UserStatus } from "./value-object/Status.js";
import { Avatar } from "./value-object/Avatar.js";
import { Win } from "./value-object/Win.js";
import { Loose } from "./value-object/Loose.js";


export interface IPasswordHasher { hash(password: string): Promise<string>; }


export interface IUserProps {
	id: UserId;
	login: Login;
	display_name: DisplayName;
	email: Email;
	passwordHash: PasswordHash;
	status: UserStatus;
	avatar: Avatar | null;
	win: Win;
	loose: Loose;
}


export type RawUserType = {
	id_user?: unknown;
	login: unknown;
	display_name: unknown;
	email: unknown;
	plainPassword: unknown;
	status?: unknown;
	avatar?: unknown | null;
	win?: unknown;
	loose?: unknown;
}


export type DbUserType = {
	id_user: number;
	login: string;
	display_name: string;
	email: string;
	passwordHash: string;
	status: string;
	avatar?: string | null;
	win: number;
	loose: number;
}


export type InsertUserType = Omit<DbUserType, 'id_user'>;


export class User {

	private constructor(
		public readonly id: UserId,
		public readonly login: Login,
		public readonly display_name: DisplayName,
		public readonly email: Email,
		public readonly passwordHash: PasswordHash,
		public readonly status: UserStatus = UserStatus.online(),
		public readonly avatar: Avatar | null = null,
		public readonly win: Win = Win.default(),
		public readonly loose: Loose = Loose.default()
	) {}

	static async createFromRaw(raw: RawUserType, deps: { hasher: IPasswordHasher }): Promise<User>	{
		const id = raw.id_user ? UserId.create(raw.id_user) : UserId.newTemporary();
		const login = Login.create(raw.login);
		const display_name = DisplayName.create(raw.display_name);
		const email = Email.create(raw.email);
		const plainPassword = PlainPassword.create(raw.plainPassword);
		const status = raw.status ? UserStatus.create(raw.status) : UserStatus.online();
		const avatar = raw.avatar ? Avatar.create(raw.avatar) : null;
		const win = raw.win ? Win.create(raw.win) : Win.default();
		const loose = raw.loose ? Loose.create(raw.loose) : Loose.default();
		let hash: string;
		try {
			hash = await deps.hasher.hash(plainPassword.value);
		} catch (error) {
			throw new Error("Error while hashing password.");
		}
		const passwordHash = PasswordHash.fromHash(hash);
		return User.createFromVO({
			id,
			login,
			display_name,
			email,
			passwordHash,
			status,
			avatar,
			win,
			loose
		});
	}

	static createFromVO(props: {
		id?: UserId | null,
		login: Login,
		display_name: DisplayName,
		email: Email,
		passwordHash: PasswordHash,
		status?: UserStatus,
		avatar?: Avatar | null,
		win?: Win,
		loose?: Loose
	}): User {
		return new User(
			props.id ?? UserId.newTemporary(),
			props.login,
			props.display_name,
			props.email,
			props.passwordHash,
			props.status ?? UserStatus.online(),
			props.avatar ?? null,
			props.win ?? Win.default(),
			props.loose ?? Loose.default()
		);
	}

	static createFromDb(row: DbUserType): User {
		return new User(
			UserId.fromDb(row.id_user),
			Login.fromDb(row.login),
			DisplayName.fromDb(row.display_name),
			Email.fromDb(row.email),
			PasswordHash.fromDb(row.passwordHash),
			UserStatus.fromDb(row.status),
			row.avatar ? Avatar.fromDb(row.avatar) : null,
			Win.fromDb(row.win),
			Loose.fromDb(row.loose)
		);
	}

	toDb(): InsertUserType {
		return {
			login: this.login.value,
			display_name: this.display_name.value,
			email: this.email.value,
			passwordHash: this.passwordHash.value,
			status: this.status.value,
			avatar: this.avatar ? this.avatar.value : null,
			win: this.win.value,
			loose: this.loose.value
		};
	}
}
