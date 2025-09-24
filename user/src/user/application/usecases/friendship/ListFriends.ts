import { IFriendshipRepository } from "../../../domain/IFriendshipRepository";
import { UserId } from "../../../domain/value-object/UserId.js";
import { FriendListDTO } from "../../dto/FriendListDTO.js";


export class ListFriends {

	private readonly repo: IFriendshipRepository;

	constructor(repo: IFriendshipRepository) {
		this.repo = repo;
	}

	async execute(userId: UserId): Promise<FriendListDTO> {
		const rows = this.repo.listFriends(userId);
		return rows;
	}

}