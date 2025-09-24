import Fastify from 'fastify';
import fs from 'fs';
import { setupApi } from './api.js';

const options = {
  key: fs.readFileSync('/etc/ssl/selfsigned.key'),
  cert: fs.readFileSync('/etc/ssl/selfsigned.crt'),
};

async function main() {
  const app = Fastify({
    logger: true,
    https: options,
  });

  await setupApi(app);

  await app.listen({ port: 3003, host: '0.0.0.0' });

  console.log("🧠 Serveur IA prêt, en attente de parties via /ai/joinGame...");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
