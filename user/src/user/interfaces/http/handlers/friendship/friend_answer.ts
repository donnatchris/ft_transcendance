import { FastifyRequest, FastifyReply } from 'fastify';
import { UserId } from '../../../../domain/value-object/UserId.js';
import { AnswerFriendRequest } from '../../../../application/usecases/friendship/AnswerFriendRequest.js';
import { SqliteFriendshipRepository } from '../../../../infrastructure/sqlite/SqliteFriendshipRepository.js';


export default async function friendAnswer(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	console.log("[Users: friendAnswer] friendAnswer handler called.");
	if (!request.user) {
		return reply.status(401).send({
			success: false,
			message: "Unauthorized."
		});
	}
	const { friendRequest, answer } = request.body as { friendRequest: number, answer: string };
	if (!friendRequest || !answer || !(answer === 'declined' || answer === 'accepted')) {
		console.log("[Users: friendAnswer] invalid or missing parameters.");
		return reply.status(400).send({
			success: false,
			message: "Invalid or missing parameters."
		});
	}
	const id = UserId.create(request.user.id_user);
	const useCase = new AnswerFriendRequest(new SqliteFriendshipRepository());
	await useCase.execute(id, { friendRequest: friendRequest, answer: answer as 'accepted' | 'declined' });
	console.log("[Users: friendAnswer] answer successfully sent.");
	return reply.status(200).send({
		success: true,
		message: "Answer successfully sent."
	});
}
