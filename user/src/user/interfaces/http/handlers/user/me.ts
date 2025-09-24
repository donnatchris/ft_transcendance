import { FastifyRequest, FastifyReply } from 'fastify';


export default async function me (request: FastifyRequest,reply: FastifyReply) {
	console.log("[User: me] me handler called.");
	if (!request.user) {
		return reply.status(401).send({
		success: false,
		message: "Unauthorized." });
	}
    return reply.status(200).send({
        success: true,
        message: "User is authenticated",
        user: {
            id_user: request.user.id_user,
            login: request.user.login,
            avatar: request.user.avatar,
            display_name: request.user.display_name,
            status: request.user.status
        }
    });
}
