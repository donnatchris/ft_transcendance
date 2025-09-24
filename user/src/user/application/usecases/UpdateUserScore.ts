import { IUserRepository } from '../../domain/IUserRepository.js';
import { UserId } from '../../domain/value-object/UserId.js';


export class UpdateUserScore {
	private readonly repo: IUserRepository;

	constructor(repo: IUserRepository) {
		this.repo = repo;
	}

	async execute(id: UserId, result: 'win' | 'loose'): Promise<void> {
		if (!id) {
			throw new Error("User ID is required.");
		}
		if (result !== 'win' && result !== 'loose') {
			throw new Error("Invalid result. Must be 'win' or 'loose'.");
		}
		await this.repo.incrementScore(id, result);
	}
}
