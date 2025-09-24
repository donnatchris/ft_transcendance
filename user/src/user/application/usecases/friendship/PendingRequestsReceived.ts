import { IFriendshipRepository } from "../../../domain/IFriendshipRepository.js";
import { UserId } from "../../../domain/value-object/UserId.js";


export class PendingRequestsReceived {

	private readonly repo: IFriendshipRepository;

	constructor(repo: IFriendshipRepository) {
		this.repo = repo;
	}

	async execute(userId: UserId): Promise<any> {
		const rows = this.repo.listPendingReceived(userId);
		return rows;
	}

}
