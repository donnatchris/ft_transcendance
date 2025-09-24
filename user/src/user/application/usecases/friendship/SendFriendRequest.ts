import { IFriendshipRepository } from "../../../domain/IFriendshipRepository.js";
import { UserId } from "../../../domain/value-object/UserId.js";


export class SendFriendRequest {

	private readonly repo: IFriendshipRepository;

	constructor(repo: IFriendshipRepository) {
		this.repo = repo;
	}

	async execute(userId: UserId, friendId: UserId): Promise<void> {
		this.repo.sendFriendRequest(userId, friendId);
	}

}
