import { IFriendRepository } from "../../domain/IFriendRepository";
import { UserId } from "../../domain/value-object/UserId.js";
import { }


export class ListFriends {
	private readonly repo: IFriendRepository;

	constructor(repo: IFriendRepository) {
		this.repo = repo;
	}

	async execute(userId: string): Promise<string[]> {
		if (!userId) {
			throw new Error("User ID is required.");
		}
		const userIdObj = UserId.create(userId);
		const friends = await this.repo.listFriends(userIdObj);
		return friends;

	}
}