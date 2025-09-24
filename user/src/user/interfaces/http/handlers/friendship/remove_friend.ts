import { FastifyRequest, FastifyReply } from 'fastify';
import { UserId } from '../../../../domain/value-object/UserId.js';
import { RemoveFriend } from '../../../../application/usecases/friendship/RemoveFriend.js';
import { SqliteFriendshipRepository } from '../../../../infrastructure/sqlite/SqliteFriendshipRepository.js';


export default async function deleteFriend(request: FastifyRequest<{Body: {friend_id: number } }>, reply: FastifyReply) {
    console.log("[Users: deleteFriend] deleteFriend handler called.");
	if (!request.user) {
		return reply.status(401).send({
			success: false,
			message: "Unauthorized."
		});
	}
	const userId = UserId.create(request.user.id_user);
	const friendId = UserId.create(request.body.friend_id);
	const useCase = new RemoveFriend(new SqliteFriendshipRepository());
	await useCase.execute(userId, friendId);
	console.log("[Users: deleteFriend] friend successfully removed.");
	return reply.status(200).send({
		success: true,
		message: "Friendship successfully removed."
	});

}
