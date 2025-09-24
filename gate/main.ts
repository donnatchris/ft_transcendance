import Fastify, { FastifyReply , FastifyRequest} from 'fastify';
import fastifyHttpProxy from '@fastify/http-proxy';
import fs from 'fs';
import fastifyCors from '@fastify/cors';
import { sendLog } from './logger.js';


const options = {
  key: fs.readFileSync('/etc/ssl/selfsigned.key'),
  cert: fs.readFileSync('/etc/ssl/selfsigned.crt'),
};

const server = Fastify({
  logger: true,
  https: options
});


await server.register(fastifyCors, {
  origin: true, // ou précise les domaines front autorisés
  credentials: true,
});

server.addHook('onRequest', async (request : FastifyRequest, reply : FastifyReply) => {
  sendLog(JSON.stringify({
    type: 'request',
    method: request.method,
    url: request.url,
    ip: request.ip,
    time: new Date().toISOString()
  }));
  if (reply.statusCode)
  {
    sendLog(JSON.stringify({
      type: 'response',
      code: reply.statusCode,
      url: request.url,
      time: new Date().toISOString()
    }));

  }
});


server.register(fastifyHttpProxy, {
  upstream: 'https://user:3001',
  prefix: '/user',
  // preHandler: auth, 
});

server.register(fastifyHttpProxy, {
  upstream: 'https://game:3002',
  prefix: '/game',
  // preHandler: auth, 
});

server.register(fastifyHttpProxy, {
  upstream: 'https://ia:3003',
  prefix: '/ia',
  // preHandler: auth, 
});

server.get('/health', async (request : FastifyRequest, reply: FastifyReply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// server.register(import('@fastify/http-proxy'), {
//   upstream: 'http://auth:3004',
//   prefix: '/tournament',
// });

server.listen({ port: 3005, host: '0.0.0.0' }).then(() => {
  console.log('Server listening on port 3005');
}).catch(err => {
  server.log.error(err);
  process.exit(1);
});
