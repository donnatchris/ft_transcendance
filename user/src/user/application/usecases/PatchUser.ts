import { IUserRepository } from "../../domain/IUserRepository.js";
import { UserId } from '../../domain/value-object/UserId.js';
import { PatchUserDTO } from "../dto/UserDTO.js";
import { Login } from "../../domain/value-object/Login.js";
import { Email } from "../../domain/value-object/Email.js";
import { DisplayName } from "../../domain/value-object/DisplayName.js";
import { User } from "../../domain/User.js";
import { PlainPassword } from "../../domain/value-object/PlainPassword.js";
import { BcryptPasswordManager } from "../../utils/bcrypt2.js";


export interface IPasswordComparator {
	verify(plainPassword: unknown, hashedKey: string): Promise<boolean>;
}
		// id_user: request.user.id_user,
		// password: request.password,
		// field: request.field,
		// value: request.value

export class PatchUser {

	private readonly repo: IUserRepository;
	private readonly comparator: IPasswordComparator;

	constructor(repo: IUserRepository, comparator: IPasswordComparator) {
		this.repo = repo;
		this.comparator = comparator;
	}

	async execute(p: PatchUserDTO): Promise<User | null> {
		if (!p.id_user || !p.password) {
			throw new Error("id and password are required.");
		}
		const userId: UserId = UserId.create(p.id_user);
		const user = await this.repo.findById(userId);
		if (!user) {
			throw new Error("User not found.");
		}
		const isPasswordValid = await this.comparator.verify(p.password, user.passwordHash.value);
		if (!isPasswordValid) {
			throw new Error("Invalid password.");
		}
		if (!p.field || !p.value) {
			throw new Error("No data to update.");
		}
		if (p.field !== 'login' && p.field !== 'email' && p.field !== 'display_name' && p.field !== 'password') {
			throw new Error("Invalid field to update.");
		}
		if (p.field === 'password') {
			const plainPassword = PlainPassword.create(p.value);
			const hasher = new BcryptPasswordManager();
			const newHashedPassword = await hasher.hash(plainPassword.value);
			return await this.repo.updateProfile(userId,  { field: 'passwordHash', value: newHashedPassword });
		}
		if (p.field === 'login') {
			const login = Login.create(p.value);
			return await this.repo.updateProfile(userId, { field: p.field, value: login.value });

		}
		if (p.field === 'email') {
			const email = Email.create(p.value);
			return await this.repo.updateProfile(userId, { field: p.field, value: email.value });
		}
		if (p.field === 'display_name') {
			const displayName = DisplayName.create(p.value);
			return await this.repo.updateProfile(userId, { field: p.field, value: displayName.value });
		}
    	return null;
	}
}
