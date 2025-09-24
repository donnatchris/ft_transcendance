import { FastifyRequest, FastifyReply } from 'fastify';
import { getTokenPayload, UserTokenPayloadType } from '../../../utils/jwt.js';


declare module "fastify" {
	interface FastifyRequest {
		user?: UserTokenPayloadType;
	}
}


export default async function nonAuthenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	console.log("[User: nonAuthenticate] nonAuthenticate handler called.");
	const token = getTokenPayload(request);
	if (token) {
		return reply.status(403).send({
			success: false,
			message: "You are already authenticated.."
		});
	}
}
