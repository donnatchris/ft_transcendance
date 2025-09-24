import { IFriendshipRepository } from "../../../domain/IFriendshipRepository.js";
import { UserId } from "../../../domain/value-object/UserId.js";


export class PendingRequestsSent {

	private readonly repo: IFriendshipRepository;

	constructor(repo: IFriendshipRepository) {
		this.repo = repo;
	}

	async execute(userId: UserId): Promise<any> {
		const rows = this.repo.listPendingSent(userId);
		return rows;
	}

}
