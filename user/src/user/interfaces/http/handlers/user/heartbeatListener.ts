import { FastifyRequest, FastifyReply } from 'fastify';
import { UserId } from '../../../../domain/value-object/UserId.js';
import { SqliteUserRepository } from '../../../../infrastructure/sqlite/SqliteUserRepository.js';
import { Heartbeat } from '../../../../application/usecases/Heartbeat.js';


export default async function heartbeatListener(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	console.log("[User: heartbeat] heartbeat handler called.");
	if (!request.user) {
    	return reply.status(401).send({
			success: false,
			message: "Unauthorized." });
	}
	const id = UserId.create(request.user.id_user);
	const useCase = new Heartbeat(new SqliteUserRepository());
	await useCase.execute(id);
	return reply.status(200).send({
		success: true,
		message: "Heartbeat successful, user status updated."
	});
}
