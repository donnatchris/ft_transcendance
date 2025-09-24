import { FastifyRequest, FastifyReply } from 'fastify';
import { UserId } from '../../../../domain/value-object/UserId.js';
import { PendingRequestsReceived } from '../../../../application/usecases/friendship/PendingRequestsReceived.js';
import { SqliteFriendshipRepository } from '../../../../infrastructure/sqlite/SqliteFriendshipRepository.js';

export default async function friendsPendingInvitations(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	console.log("[Users: friendsPendingInvitations] friendsPendingInvitations handler called.");
	if (!request.user) {
		return reply.status(401).send({
			success: false,
			message: "Unauthorized."
		});
	}
	const id = UserId.create(request.user.id_user);
	const useCase = new PendingRequestsReceived(new SqliteFriendshipRepository());
	const invitations = await useCase.execute(id);
	console.log("[Users: friendsPendingInvitations] list successfully fetched.");
	return reply.status(200).send({
		success: true,
		message: "Users friends pending invitations successfully fetched.",
		invitations: invitations
	});
}
