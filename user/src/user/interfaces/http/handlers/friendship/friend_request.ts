import { FastifyRequest, FastifyReply } from 'fastify';
import { SqliteFriendshipRepository } from '../../../../infrastructure/sqlite/SqliteFriendshipRepository.js';
import { SendFriendRequest } from '../../../../application/usecases/friendship/SendFriendRequest.js';
import { UserId } from '../../../../domain/value-object/UserId.js';


export default async function friendRequest(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	console.log("[User: friendRequest] friendRequest handler called.");
	if (!request.user) {
		return reply.status(401).send({
			success: false,
			message: "Unauthorized."
		});
	}
	const { targetUserId } = request.body as { targetUserId: number };
	if (!targetUserId) {
		console.log("[User: friendRequest] missing targetUserId.");
		return reply.status(400).send({
			success: false,
			message: "Missing friend."
		});
	}
	const userId = UserId.create(request.user.id_user);
	const friendId = UserId.create(targetUserId);
	if (userId.equals(friendId)) {
		console.log("[User: friendRequest] cannot send friend request to oneself.");
		return reply.status(400).send({
			success: false,
			message: "Cannot send friend request to oneself."
		});
	}
	const useCase = new SendFriendRequest(new SqliteFriendshipRepository());
	await useCase.execute(userId, friendId);
	console.log(`[User: friendRequest] Friend request sent from user ${request.user.id_user} to user ${targetUserId}.`);
	return reply.status(201).send({
		success: true,
		message: "Friend request sent successfully."
	});

}
