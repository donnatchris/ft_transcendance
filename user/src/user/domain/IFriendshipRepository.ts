import { UserId } from "./value-object/UserId.js";


export interface IPendingRequest {
	requestId: number;
	from: UserId;
}


export interface IFriendRow {
	id_user: number;
	display_name: string;
	avatar: string | null;
	status: string;
	win: number;
	loose: number;
}


export interface IFriendshipRepository {
	listFriends(userId: UserId): Promise<IFriendRow[]>;
	listPendingReceived(userId: UserId): Promise<IPendingRequest[]>;
	listPendingSent(userId: UserId): Promise<IPendingRequest[]>;
	listAddablePeople(userId: UserId): Promise<UserId[]>;
	areFriends(a: UserId, b: UserId): Promise<boolean>;
	sendFriendRequest(a: UserId, b: UserId): Promise<void>
	answerFriendRequest(userId: UserId, p: { friendRequest: number, answer: 'accepted' | 'declined' }): Promise<void>;
	removeFriendship(a: UserId, b: UserId): Promise<void>;
}
