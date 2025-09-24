import { FastifyPluginAsync } from "fastify";
import GameLiveController from "../controllers/GameLive.Controller.js";
import { handleWsConnection } from "../game_server/server.js";

const gameRoutes: FastifyPluginAsync = async (fastify, opts) => {
	fastify.get("/ws", { websocket: true }, handleWsConnection);
	fastify.get("/", GameLiveController.list);
	fastify.post("/", GameLiveController.createNew);
	fastify.get("/:id", GameLiveController.get);
	fastify.post("/:id", GameLiveController.sendCmd);
};

export default gameRoutes;
