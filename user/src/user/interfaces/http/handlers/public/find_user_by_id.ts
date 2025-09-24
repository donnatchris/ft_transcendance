import { FastifyReply, FastifyRequest } from "fastify";
import { SqliteUserRepository } from '../../../../infrastructure/sqlite/SqliteUserRepository.js';
import { FindUserById } from "../../../../application/usecases/FindUserById.js";


export type FindUserByIdParamsType = {
	id: number;
}

export default async function findUserById(request: FastifyRequest<{ Body: FindUserByIdParamsType }>, reply: FastifyReply) {
	console.log("[User: findUserById] findUserById handler called.");
	const id = request.body?.id;
	if (!id) {
		return reply.status(400).send({
			success: false,
			message: "Missing id parameter." });
	}
	const useCase = new FindUserById(new SqliteUserRepository());
	const user = await useCase.execute(id);
	if (!user) {
		return reply.status(404).send({
			success: false,
			message: "User not found." });
	}
	return reply.status(200).send({
		success: true,
		user: user
	});

}