import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyHttpProxy from '@fastify/http-proxy';
import fs from 'fs';
import httpProxy, { ServerOptions } from 'http-proxy';




const options = {
  key: fs.readFileSync('/etc/ssl/selfsigned.key'),
  cert: fs.readFileSync('/etc/ssl/selfsigned.crt'),
};

const app = Fastify({
  logger: true,
  https: options
});

app.register(fastifyHttpProxy, {
  upstream: 'https://gate:3005',
  prefix: '/gate'
});

const wsProxy = httpProxy.createProxyServer({
  target: 'wss://game:3002',
  changeOrigin: true,
  ws: true,
  secure: false
} as ServerOptions);

wsProxy.on('proxyReqWs', (proxyReq, req, socket, options, head) => {
  if (req.url?.startsWith('/gamews')) {
    proxyReq.path = req.url.replace(/^\/gamews/, '');
  }
});

app.server.on('upgrade', (req, socket, head) => {
  if (req.url?.startsWith('/gamews')) {
    wsProxy.ws(req, socket, head);
  }
});

app.register(fastifyStatic, {
  root: '/var/www/public',
  prefix: '/',
});

app.get('/', async (_req: FastifyRequest, reply: FastifyReply) => {
  return reply.sendFile('index.html');
});

app.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Démarre le serveur
app.listen({ port: 3000, host: '0.0.0.0'}).then(() => {
  console.log('Server listening on port 3000');
}).catch(err => {
  app.log.error(err);
  process.exit(1);
});
