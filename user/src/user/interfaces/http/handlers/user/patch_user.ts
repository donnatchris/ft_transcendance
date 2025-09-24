import { FastifyRequest, FastifyReply } from 'fastify';
import { PatchUser } from '../../../../application/usecases/PatchUser.js';
import { PatchUserDTO } from '../../../../application/dto/UserDTO.js';
import { SqliteUserRepository } from '../../../../infrastructure/sqlite/SqliteUserRepository.js';
import { BcryptPasswordManager } from '../../../../utils/bcrypt2.js';
import { createJWT } from '../../../../utils/jwt.js';
import { cookieOptions } from '../../../../../const/const.js';
import { UserMapper } from '../../../../application/dto/UserMapper.js';


// type Body = {
// 	password: string;
// 	plainPassword?: string;
// 	login?: string;
// 	display_name?: string;
// 	email?: string;
// };

type PatchBody = {
	field: "login" | "display_name" | "email" | "password",
	value: string,
	password: string
};

export default async function patchUser (request: FastifyRequest<{ Body: PatchBody }>,reply: FastifyReply) {
	console.log("[User: patchUser] patchUser handler called.");
	if (!request.user) {
		return reply.status(401).send({
		success: false,
		message: "Unauthorized." });
	}
	if (!request.body.password) {
		return reply.status(400).send({
			success: false,
			message: "Password is required."
		});
	}
	if (!request.body.field || !request.body.value) {
		return reply.status(400).send({
			success: false,
			message: "No data tu update."
		});
	}
	const useCase = new PatchUser(new SqliteUserRepository(), new BcryptPasswordManager());
	const params: PatchUserDTO = {
		id_user: request.user.id_user,
		password: request.body.password,
		field: request.body.field,
		value: request.body.value
	};
	const updatedUser = await useCase.execute(params);
	if (!updatedUser) {
		return reply.status(400).send({
			success: false,
			message: "Unable to update user data."
		});
	}
	const u = UserMapper.toMeDTO(updatedUser);
	const newToken = createJWT(u.id_user, u.login, u.display_name, u.avatar ?? "", u.status);
	console.log("[User: patchUser] user successfully updated.");
	return reply
	.setCookie('token', newToken, cookieOptions)
	.status(200)
	.send({
		success: true,
		message: "User has been successfully updated.",
		});
}
