import { IUserRepository } from "../../domain/IUserRepository.js";
import { UserId } from "../../domain/value-object/UserId.js";
import { UserMapper } from "../dto/UserMapper.js";
import { UserMeDTO } from "../dto/UserDTO.js";


export class UserProfile {

	private readonly repo: IUserRepository;

	constructor(repo: IUserRepository) {
		this.repo = repo;
	}

	async execute(id: UserId): Promise<UserMeDTO> {
		const user = await this.repo.findById(id);
		if (!user) {
			throw new Error("User not found.");
		}
		return UserMapper.toMeDTO(user);
	}
}
