import { FastifyRequest, FastifyReply } from "fastify";

export async function auth(request: FastifyRequest, reply: FastifyReply) {
    const token = request.headers['authorization'];
    const apiKey = process.env.API_KEY;

    if (!token || token !== apiKey) {
        return reply.code(401).send({ error: 'Unauthorized' });
    }
    return ;
}
