import { IUserRepository } from "../../domain/IUserRepository.js";
import { User, IPasswordHasher } from "../../domain/User.js";
import { UserMapper } from "../dto/UserMapper.js";
import { UserMeDTO } from "../dto/UserDTO.js";


export type RegisterParamsType = {
	login: string;
	display_name: string;
	email: string;
	plainPassword: string;
}

export class RegisterUser {

	private readonly repo: IUserRepository;
	private readonly hasher: IPasswordHasher;

	constructor(repo: IUserRepository, hasher: IPasswordHasher) {
		this.repo = repo;
		this.hasher = hasher;
	}

	async execute(p: RegisterParamsType): Promise<UserMeDTO> {
		const user = await User.createFromRaw({
			login: p.login,
			display_name: p.display_name,
			email: p.email,
			plainPassword: p.plainPassword,
		}, { hasher: this.hasher });
		const persisted =  await this.repo.save(user);
		console.log("[User: RegisterUser] user created with id:", persisted.id.value);
		return UserMapper.toMeDTO(persisted);
	}
}
