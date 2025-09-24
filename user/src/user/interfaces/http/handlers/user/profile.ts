import { FastifyRequest, FastifyReply } from 'fastify';
import { SqliteUserRepository } from '../../../../infrastructure/sqlite/SqliteUserRepository.js';
import { UserId } from '../../../../domain/value-object/UserId.js';
import { UserProfile } from '../../../../application/usecases/UserProfile.js';


export default async function profile(request: FastifyRequest, reply: FastifyReply) {
	console.log("[User: profile] profile handler called.");
	if (!request.user) {
		return reply.status(401).send({
		success: false,
		message: "Unauthorized." });
	}
	const uc = new UserProfile(new SqliteUserRepository());
	const id = UserId.create(request.user.id_user);
	const profileDTO = await uc.execute(id);
	return reply.status(200).send({
		success: true,
		message: "User profile has been successfuly found.",
		profile: profileDTO
	});
}
