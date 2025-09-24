import { FastifyRequest, FastifyReply } from 'fastify';
import { DeleteUser } from '../../../../application/usecases/DeleteUser.js';
import { SqliteUserRepository } from '../../../../infrastructure/sqlite/SqliteUserRepository.js';
import { AvatarFsRepository } from '../../../../infrastructure/storage/AvatarFSRepository.js';
import { BcryptPasswordManager } from '../../../../utils/bcrypt2.js';
import { DeleteUserParamsType } from '../../../../application/usecases/DeleteUser.js';
import { cookieOptions } from '../../../../../const/const.js';


type Body = { plainPassword: string };

export default async function deleteMe(request: FastifyRequest<{Body: Body}>, reply: FastifyReply) {
    console.log("[User: deleteMe] deleteMe handler called.");
	if (!request.user) {
		return reply.status(401).send({
			success: false,
			message: "Unauthorized."
		});
	}
	if (!request.body.plainPassword) {
		return reply.status(400).send({
			success: false,
			message: "Password is required."
		});
	}
	const params: DeleteUserParamsType = {
		id_user: String(request.user.id_user),
		plainPassword: String(request.body.plainPassword)
	}
	const useCase = new DeleteUser(new SqliteUserRepository(), new BcryptPasswordManager(), new AvatarFsRepository());
	await useCase.execute(params);
	console.log("[User: deleteMe] user successfully crreated.");
	return reply
		.clearCookie('token', cookieOptions)
		.status(200)
		.send({
			success: true,
			message: "User successfuly deleted."
		});
}
