import { User } from "./User.js";
import { UserId } from "./value-object/UserId.js";
import { Login } from "./value-object/Login.js";
import { Email } from "./value-object/Email.js";

export interface IUserRepository {
	getAllUsers(): Promise<any>;
	getNbOnlineUsers() : Promise<any>;
	findById(id: UserId): Promise<User | null>;
	findByLogin(login: Login): Promise<User | null>;
	findByEmail(email: Email): Promise<User | null>;
	findByIdentifier(identifier: unknown): Promise<User | null>;

	save(user: User): Promise<User>;
	updateProfile(id: UserId, p: { field: string, value: string }): Promise<User | null>;
	incrementScore(id: UserId, result: 'win' | 'loose'): Promise<void>;
	delete(id: UserId): Promise<void>;
	touchOnline(id: UserId): Promise<void>;
}
