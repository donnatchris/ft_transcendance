import { FastifyRequest, FastifyReply } from "fastify";
import TournamentService from "../services/Tournament.service.js";
import z from "zod";
import { validate } from "../validator.js";

const CreateTournamentSchema = z.object({
	name: z.string(),
	createdBy: z.number(),
});

const RegisterPlayerSchema = z.object({
	tournamentId: z.number(),
	userId: z.number(),
});

class TournamentController {
	static async createNew(req: FastifyRequest, reply: FastifyReply) {
		const { name, createdBy } = validate(CreateTournamentSchema, req.body);
		const tournament = await TournamentService.createTournament(name, createdBy);
		reply.send({ message: "Tournoi créé", tournament });
	}

	static async registerPlayer(req: FastifyRequest, reply: FastifyReply) {
		const { tournamentId, userId } = validate(RegisterPlayerSchema, req.body);
		const result = await TournamentService.registerPlayer(tournamentId, userId);
		reply.send(result);
	}

	static async listPlayers(req: FastifyRequest, reply: FastifyReply) {
		const { id } = validate(z.object({ id: z.coerce.number() }), req.params);
		const players = await TournamentService.listPlayers(id);
		reply.send(players);
	}

	static async start(req: FastifyRequest, reply: FastifyReply) {
		const { id } = validate(z.object({ id: z.coerce.number() }), req.params);
		const result = await TournamentService.startTournament(id);
		reply.send(result);
	}
}

export default TournamentController;
