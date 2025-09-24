import { FastifyRequest, FastifyReply } from 'fastify';
import { createJWT } from '../../../../utils/jwt.js';
import { SqliteUserRepository } from '../../../../infrastructure/sqlite/SqliteUserRepository.js';
import { cookieOptions } from '../../../../../const/const.js';
import { BcryptPasswordManager } from '../../../../utils/bcrypt2.js';
import { LoginUser, LoginParamsType } from '../../../../../user/application/usecases/LoginUser.js';


export default async function login(request: FastifyRequest<{ Body: LoginParamsType }>, reply: FastifyReply) {
	console.log("[User: login] login handler called.");
	const params: LoginParamsType = request.body;
	const useCase = new LoginUser(new SqliteUserRepository(), new BcryptPasswordManager());
	const u = await useCase.execute(params);
	console.log("[User: login] User logged in successfully.");
	const token = createJWT(u.id_user, u.login, u.display_name, u.avatar ?? "", "online");
	console.log("[User: login] JWT created successfully.");
	return reply
		.setCookie('token', token, cookieOptions)
		.status(200)
		.send({
			success: true,
			message: "User successfully logged in,! Redirecting...",
			});
}
