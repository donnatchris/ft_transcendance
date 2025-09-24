import { FastifyRequest, FastifyReply } from 'fastify';
import { cookieOptions } from '../../../../../const/const.js';


export default async function logout(request: FastifyRequest, reply: FastifyReply) {
    console.log("[User: logout] logout handler called.");
	if (!request.user) {
		return reply.status(401).send({
		success: false,
		message: "Unauthorized." });
	}
    return reply
        .clearCookie('token', cookieOptions)
        .status(200)
        .send({
            success: true,
            message: "User successfuly logout."
        });
}
