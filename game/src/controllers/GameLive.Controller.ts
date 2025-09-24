import { FastifyRequest, FastifyReply } from "fastify";
import { createRoomSchema } from "../game_server/RoomManager.class.js";
import { isClientMessage, manager } from "../game_server/server.js";
import z from "zod";
import { validate } from "../validator.js";
import { GameRoom } from "../game_server/GameRoom.class.js";
import { ClientKeyMessage, GameRoomInfo } from "@transcendance/types/index.js";
import { GameService } from "../services/Game.service.js";

const formatRoom = (room: GameRoom): GameRoomInfo => {
	return {
		id: room.id,
		mode: room.mode,
		players: room.registeredPlayerList,
		max: room.player_limit,
	};
};

class GameLiveController {
	static async list(request: FastifyRequest, reply: FastifyReply) {
		const list = manager.list.map(([_, room]) => formatRoom(room));
		return reply.send(list);
	}

	static async get(request: FastifyRequest, reply: FastifyReply) {
		const data = validate(z.object({ id: z.string() }), request.params);
		const room = manager.get(data.id);
		if (room) reply.send(formatRoom(room));
		else {
			reply.code(404).send();
		}
	}

	static async sendCmd(request: FastifyRequest, reply: FastifyReply) {
		// Removed logging of the entire request object to avoid exposing sensitive information.
		if (!request.token) return reply.code(401).send();
		const user_id = request.token.id_user;
		try {
			const params = validate(z.object({ id: z.string() }), request.params);
			const { body } = request;
			const room = manager.get(params.id);
			if (!room || !isClientMessage(body)) throw new Error("Invalid Body");
			const p = room.registeredPlayerList.find((p) => p.id == user_id);
			if (p === undefined) throw new Error("Player not in the room");
			handleMessageHttp(room, p.localId, body);
			return reply.send();
		} catch (error) {
			return reply.code(500).send();
		}
	}

	static async createNew(request: FastifyRequest, reply: FastifyReply) {
		const body = validate(createRoomSchema.omit({ timeout: true, locked: true }), request.body);
		const { players, mode, requestIa } = body;
		let timeout;
		if (mode === "local" || requestIa === true) {
			timeout = 10000;
		} else timeout = undefined;
		try {
			const room = manager.createRoom({
				id: body.id,
				players,
				mode,
				timeout,
				locked: true,
				requestIa,
			});
			const id = room.id;
			room.unlock();
			return reply.send({ id });
		} catch (error) {
			error instanceof Error && console.error(error);
		}
		return reply.code(500).send();
	}

	static async playerHistory(request: FastifyRequest, reply: FastifyReply) {
		const { userId } = validate(z.object({ userId: z.number() }), request.body);
		const user = await GameService.getPlayerHistory(userId);
		reply.send(user);
	}
}

function handleMessageHttp(room: GameRoom, localId: number, message: unknown) {
	try {
		message = typeof message == "string" ? JSON.parse(message) : message;
		if (isClientMessage(message)) {
			switch (message.type) {
				case "keydown":
				case "keyup":
					return handleKeyMsg(room, localId, message);
				case "join":
					return;
				//return handleJoinMsg(player, message);
				default:
					break;
			}
		}
	} catch (err) {}
	return false;
}

function handleKeyMsg(room: GameRoom, localId: number, msg: ClientKeyMessage): boolean {
	const { type, key } = msg;
	const game = room.game;

	const index = localId - 1;
	if (type == "keyup") {
		game.removeInput(index, key);
	} else if (type == "keydown") {
		game.registerInput(index, key);
	}
	return true;
}

export default GameLiveController;
