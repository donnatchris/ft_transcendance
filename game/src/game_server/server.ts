const IA_KEY = process.env.IA_KEY;
import { WebSocket } from "@fastify/websocket";
import { ClientMessage, ClientKeyMessage, ClientJoinMessage, LeaveMessage } from "@transcendance/types";
import { Player } from "./Player.class.js";
import { RoomManager } from "./RoomManager.class.js";
import { FastifyRequest } from "fastify";

export function isClientMessage(msg: unknown): msg is ClientMessage {
	if (typeof msg !== "object" || msg === null) return false;

	const m = msg as any;

	switch (m.type) {
		case "keydown":
		case "keyup":
			return typeof m.key === "string";
		case "get":
			return typeof m.id === "number" && typeof m.arg === "string";
		case "join":
			return typeof m.roomId === "string";
		case "leave":
			return true;
		default:
			return false;
	}
}

export const manager = new RoomManager();
export async function handleWsConnection(socket: WebSocket, request: FastifyRequest) {
	let id;
	if (!request.token) {
		const auth = request.headers.authorization;
		if (auth && auth.startsWith("Bearer ") && auth.slice(7) === IA_KEY) {
			id = 0;
		} else {
			return socket.close(1008, "Invalid token");
		}
	} else {
		id = request.token.id_user;
	}

	const player = new Player(id, socket);
	manager.register(player);
	console.info(`WS: New Player ${player.id}`);
	socket.on("message", (data) => handleMessage(player, data.toString()));
}
export function handleMessage(player: Player, message: unknown): boolean {
	try {
		message = typeof message == "string" ? JSON.parse(message) : message;
		if (isClientMessage(message)) {
			switch (message.type) {
				case "keydown":
				case "keyup":
					return handleKeyMsg(player, message);
				case "get":
					return true;
				case "join":
					return handleJoinMsg(player, message);
				case "leave":
					return handleLeaveMsg(player, message);
				default:
					break;
			}
		}
	} catch (err) {}
	return false;
}

function handleKeyMsg(player: Player, msg: ClientKeyMessage): boolean {
	const { type, key } = msg;
	if (!player.room || !player.localId) return false;
	const game = player.room?.game;

	const index = player.localId - 1;
	if (type == "keyup") {
		game.removeInput(index, key);
	} else if (type == "keydown") {
		game.registerInput(index, key);
	}
	return true;
}

function handleJoinMsg(player: Player, msg: ClientJoinMessage): boolean {
	const { roomId } = msg;
	try {
		manager.join(roomId, player);
	} catch (error) {
		console.debug(error instanceof Error ? error.message : "Join ERROR");
		return false;
	}
	return true;
}

function handleLeaveMsg(player: Player, msg: LeaveMessage): boolean {
	manager.leave(player);
	return true;
}
