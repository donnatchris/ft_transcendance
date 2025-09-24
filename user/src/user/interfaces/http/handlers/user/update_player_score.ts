import { FastifyRequest, FastifyReply } from 'fastify';
import { getTokenPayload } from '../../../../utils/jwt.js'
import { SqliteUserRepository } from '../../../../infrastructure/sqlite/SqliteUserRepository.js';
import { UpdateUserScore } from '../../../../application/usecases/UpdateUserScore.js';
import { UserId } from '../../../../domain/value-object/UserId.js';


const allowedResult = ['win', 'loose'] as const;
type ChangeResult = typeof allowedResult[number];
interface ChangeScore {
	id_user: number;
	result: ChangeResult;
}


export default async function incrementPlayerScore(request: FastifyRequest<{ Body: ChangeScore }>, reply: FastifyReply) {
	console.log("[User: incrementPlayerScore] incrementPlayerScore handler called.");
	const payload = getTokenPayload(request);
	if (!payload) {
		console.log("[User: incrementPlayerScore] User is not authenticated.");
		return reply.status(401).send({
			success: false,
			message: "Failed to update score: user not authenticated."
		});
	}
	const { id_user, result } = request.body;
	if (!id_user || !result) {
		console.log("[User: incrementPlayerScore] Missing id_user or result.");
		return reply.status(400).send({
			success: false,
			message: "Missing id_user or result."
		});
	}
	const useCase = new UpdateUserScore(new SqliteUserRepository());
	const id = UserId.create(id_user);
	await useCase.execute(id, result);
	console.log("[User: incrementPlayerScore] User score updated successfully.");
	return reply.status(200).send({
		success: true,
		message: "User score updated successfully."
	});
}
