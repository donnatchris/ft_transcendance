import { FastifyRequest, FastifyReply } from 'fastify';
import { ListFriends } from '../../../../application/usecases/friendship/ListFriends.js';
import { SqliteFriendshipRepository } from '../../../../infrastructure/sqlite/SqliteFriendshipRepository.js';
import { UserId } from '../../../../domain/value-object/UserId.js';


export default async function friends(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	console.log("[User: friends] friends handler called");
	if (!request.user) {
		return reply.status(401).send({
			success: false,
			message: "Unauthorized."
		});
	}
	const useCase = new ListFriends(new SqliteFriendshipRepository());
	const id = UserId.create(request.user.id_user);
	const friendArray = await useCase.execute(id);
	console.log("[User: friends] friends list successfully fetched.");
	return reply.status(200).send({
		success: true,
		message: "Friends list successfully fetched.",
		friends: friendArray
	});
}
