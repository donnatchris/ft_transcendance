import { IUserRepository } from "../../domain/IUserRepository.js";
import { UserPublicListDTO } from "../dto/UserDTO.js";


export class GetAllUsers {
	private readonly repo: IUserRepository;

	constructor(repo: IUserRepository) {
		this.repo = repo;
	}

	async execute(): Promise<UserPublicListDTO> {
		const users = await this.repo.getAllUsers();
		return users;
	}
}
