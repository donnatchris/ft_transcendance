import { IFriendshipRepository } from "../../../domain/IFriendshipRepository.js";
import { UserId } from "../../../domain/value-object/UserId.js";


export class RemoveFriend {

	private readonly repo: IFriendshipRepository;

	constructor(repo: IFriendshipRepository) {
		this.repo = repo;
	}

	async execute(user: UserId, friend: UserId): Promise<void> {
		this.repo.removeFriendship(user, friend);
	}

}
