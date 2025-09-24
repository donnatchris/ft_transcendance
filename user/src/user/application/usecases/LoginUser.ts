import { IUserRepository } from "../../domain/IUserRepository.js";
import { UserMapper } from "../dto/UserMapper.js";
import { UserMeDTO } from "../dto/UserDTO.js";

export type LoginParamsType = {
	identifier: string;
	plainPassword: string;
}

export interface IPasswordComparator {
	verify(plainPassword: unknown, hashedKey: string): Promise<boolean>;
}


export class LoginUser {

	private readonly repo: IUserRepository;
	private readonly comparator: IPasswordComparator;

	constructor(repo: IUserRepository, comparator: IPasswordComparator) {
		this.repo = repo;
		this.comparator = comparator;
	}
	async execute(p: LoginParamsType): Promise<UserMeDTO> {
		const identifier = p.identifier;
		const plainPassword = p.plainPassword;
		if (!identifier || !plainPassword) {
			throw new Error("Identifier and password are required.");
		}
		const user = await this.repo.findByIdentifier(identifier);
		if (!user) {
			throw new Error("User not found.");
		}
		const isPasswordValid = await this.comparator.verify(plainPassword, user.passwordHash.value);
		if (!isPasswordValid) {
			throw new Error("Invalid password.");
		}
		return UserMapper.toMeDTO(user);
	}
}
