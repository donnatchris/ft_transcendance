import { FastifyPluginAsync } from "fastify";
import gameRoutes from "./game.routes.js";
import tournamentRoutes from "./tournament.routes.js";
import { FastifyRequest, FastifyReply } from "fastify";
import { manager } from "../game_server/server.js";

const routes: FastifyPluginAsync = async (fastify, opts) => {
	fastify.get("/health", async (request: FastifyRequest, reply: FastifyReply) => {
		return { status: "ok", timestamp: new Date().toISOString() };
	});
	fastify.get("/monitoring", async (request: FastifyRequest, reply: FastifyReply) => {
		return { party_count: manager.list.length };
	});
	fastify.register(gameRoutes, { prefix: "/" });
	fastify.register(tournamentRoutes, { prefix: "/tournament" });
};

export default routes;
