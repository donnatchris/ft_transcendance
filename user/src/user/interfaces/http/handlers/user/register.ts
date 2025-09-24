import { FastifyRequest, FastifyReply } from 'fastify';
import { createJWT } from '../../../../utils/jwt.js';
import { RegisterParamsType } from '../../../../../user/application/usecases/RegisterUser.js';
import { SqliteUserRepository } from '../../../../infrastructure/sqlite/SqliteUserRepository.js';
import { BcryptPasswordManager } from '../../../../utils/bcrypt2.js';
import { cookieOptions } from '../../../../../const/const.js';
import { RegisterUser } from '../../../../../user/application/usecases/RegisterUser.js';


export default async function register(request: FastifyRequest<{ Body: RegisterParamsType }>, reply: FastifyReply) {
	const registerParams: RegisterParamsType = request.body;
	const useCase = new RegisterUser(new SqliteUserRepository(), new BcryptPasswordManager());
	const u = await useCase.execute(registerParams);
	console.log("[User: register] user created.");		
	const token = createJWT(u.id_user, u.login, u.display_name, u.avatar ?? "", "online");
	return reply
		.setCookie('token', token, cookieOptions)
		.status(201)
		.send({
			success: true,
			message: "User has been successfully created.",
			});
}
