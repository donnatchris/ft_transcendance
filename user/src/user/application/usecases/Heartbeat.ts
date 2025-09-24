import { IUserRepository } from "../../domain/IUserRepository.js";
import { UserId } from "../../domain/value-object/UserId.js";


export class Heartbeat {
	private readonly repo: IUserRepository;

	constructor(repo: IUserRepository) {
		this.repo = repo;
	}
	async execute(id: UserId): Promise<void> {
		if (!id) {
			throw new Error("User ID is required.");
		}
		await this.repo.touchOnline(id);
	}
}
