import { FastifyRequest, FastifyReply } from 'fastify';
import { promises as fs}from 'fs';
import path from 'path';


const privacyPolicyPath = path.resolve(process.cwd(), 'privacy_policy.txt');


export default async function privacyPolicy(request: FastifyRequest, reply: FastifyReply) {
    try {
        const privacyPolicyText = await fs.readFile (privacyPolicyPath, 'utf-8');
        return reply.status(200).send({
            success: true,
            message: privacyPolicyText
        });
    } catch (error) {
        return reply.status(500).send({
            success: false,
            message: 'Unable to load privacy policy.'
        });
    }
}
