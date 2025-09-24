import { FastifyRequest, FastifyReply } from 'fastify';
import { getTokenPayload, UserTokenPayloadType } from '../../../utils/jwt.js';


declare module "fastify" {
	interface FastifyRequest {
		user?: UserTokenPayloadType;
	}
}


export default async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	console.log("[User: authenticate] authenticate handler called.");
	const token = getTokenPayload(request);
	if (!token) {
		console.log("[User: authenticate] user is not authenticated.");
		return reply.status(401).send({
			success: false,
			message: "You must be logged in to access this section.",
			token: token
		});
	}
	console.log("[User: authenticate] user is authenticated:");
	request.user = token;
}
