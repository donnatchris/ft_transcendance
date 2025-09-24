import { FastifyRequest, FastifyReply } from 'fastify';
import { UserId } from '../../../../domain/value-object/UserId.js';
import { PendingRequestsSent } from '../../../../application/usecases/friendship/PendingRequestsSent.js';
import { SqliteFriendshipRepository } from '../../../../infrastructure/sqlite/SqliteFriendshipRepository.js';

export default async function friendsPendingRequests(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	console.log("[Users: friendsPendingRequests] friendsPendingRequests handler called.");
	if (!request.user) {
		return reply.status(401).send({
			success: false,
			message: "Unauthorized."
		});
	}
	const id = UserId.create(request.user.id_user);
	const useCase = new PendingRequestsSent(new SqliteFriendshipRepository());
	const invitations = await useCase.execute(id);
	console.log("[Users: friendsPendingRequests] list successfully fetched.");
	return reply.status(200).send({
		success: true,
		message: "Users friends pending requests successfully fetched.",
		requests: invitations
	});
}
