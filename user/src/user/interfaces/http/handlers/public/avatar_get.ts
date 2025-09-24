import { createReadStream, statSync } from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { FastifyRequest, FastifyReply } from 'fastify';
import { lookup as mimeLookup } from 'mime-types';


const pump = promisify(pipeline);


export default async function avatar(request: FastifyRequest, reply: FastifyReply) {
	console.log("[User: avatar] avatar handler called.");
	const { path: rel} = request.query as { path?: string };
	if (!rel) {
		console.log("[User: avatar] path is missing.");
		return reply.status(400).send({
			success: false,
			message: "Unable to find avatar: missing path."
		});
	}
	const base = process.cwd();
	const normalized = path.normalize(rel).replace(/^(\.\.(\/|\\|$))+/, '');
	const abs = path.join(base, normalized);
	if (!abs.startsWith(base + path.sep)) {
		console.log(`[User: avatar] invalid path ${abs}.`);
		return reply.status(400).send({
			success: false,
			message: "Invalid path."
		});
	}
	try {
		const stat = statSync(abs);
		if (!stat.isFile()) {
			console.log(`[User: avatar] path ${abs} does not refer to a file.`);
			return reply.status(400).send({
				success: false,
				message: "File not found"
			});
		}
		reply.header('Cache-Control', 'public, max-age=604800');
		reply.header('Last-Modified', stat.mtime.toUTCString());
		if (request.headers['if-modified-since'] === stat.mtime.toUTCString()) {
      		return reply.code(304).send();
   		}
		const mime = mimeLookup(abs) || 'application/octet-stream';
   		reply.type(mime);
		reply.header('Content-Length', String(stat.size));
		await pump(createReadStream(abs), reply.raw);
		console.log(`[User: avatar] file ${abs} successfully sent.`);
	}
	catch (error) {
		console.log("[User: avatar] file not found: ", error);
		return reply.status(404).send({
			success: false,
			message: "File not found"
		});
	}
}
