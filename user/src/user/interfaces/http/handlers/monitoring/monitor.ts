import { FastifyRequest, FastifyReply } from 'fastify';
import { GetNbOnlineUsers } from '../../../../application/usecases/NbOnline.js';
import { SqliteUserRepository } from '../../../../infrastructure/sqlite/SqliteUserRepository.js';


export default async function onlineUsers(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	console.log("[User: onlineUsers] nbOnlineusers handler called.");
	const useCase = new GetNbOnlineUsers(new SqliteUserRepository());
	let nbonline = await useCase.execute();
	return reply.status(200).send({
		success: true,
		message: "Number of online users successfully fetched.",
		nbuser: nbonline
	});
}
