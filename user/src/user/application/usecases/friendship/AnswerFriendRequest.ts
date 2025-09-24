import { IFriendshipRepository } from "../../../domain/IFriendshipRepository.js";
import { UserId } from "../../../domain/value-object/UserId.js";


export class AnswerFriendRequest {

	private readonly repo: IFriendshipRepository;

	constructor(repo: IFriendshipRepository) {
		this.repo = repo;
	}

	async execute(userId: UserId, p: { friendRequest: number, answer: 'accepted' | 'declined' } ): Promise<void> {
		this.repo.answerFriendRequest(userId, p);
	}

}