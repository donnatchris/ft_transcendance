import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AIOpponent } from './ai-opponent.js';

const activeAIs: Record<string, AIOpponent> = {};

export async function setupApi(app: FastifyInstance) {

  app.post('/requestIa', async (request: FastifyRequest<{ Body: {id:string} }>, reply: FastifyReply) => {
		const {id} = request.body
		activeAIs[id] = new AIOpponent(id);
		reply.send()
  })
	
  app.get('/health', async (request : FastifyRequest, reply: FastifyReply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });
  // Route pour déconnecter une IA
  app.post('/ai/leaveGame', async (
    request: FastifyRequest<{ Body: { game_ia: string } }>, 
    reply: FastifyReply
  ) => {
    const { game_ia } = request.body;

    const aiInstance = activeAIs[game_ia];
    if (aiInstance) {
      aiInstance.disconnect();
      delete activeAIs[game_ia];
      console.log(`IA déconnectée de la partie ${game_ia}`);
      reply.send({ message: `IA déconnectée de la partie ${game_ia}` });
    } else {
      reply.status(404).send({ message: 'Aucune IA active pour cette partie' });
    }
  });

  app.log.info('API REST configurée');
}
