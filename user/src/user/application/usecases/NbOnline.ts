import { IUserRepository } from "../../domain/IUserRepository.js";


export class GetNbOnlineUsers {
	private readonly repo: IUserRepository;

	constructor(repo: IUserRepository) {
		this.repo = repo;
	}

	async execute(): Promise<number> {
		const users = await this.repo.getNbOnlineUsers();
		return users;
	}
}
