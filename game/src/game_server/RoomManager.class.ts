import z from "zod";
import { GameRoom, roomSchema } from "./GameRoom.class.js";
import { Player } from "./Player.class.js";
import { ServerMessage } from "@transcendance/types/index.js";
import { sendLog } from "../logger.js";
import { v4 as uuidv4 } from "uuid";
import { MatchRepository } from "../repository/MatchRepository.class.js";
import { dbAll } from "../database.js";

export const createRoomSchema = roomSchema.extend({
	id: roomSchema.shape.id.optional(),
	timeout: z.number().optional(),
	requestIa: z.boolean().optional(),
});

export type createRoomData = z.infer<typeof createRoomSchema>;

export class RoomManager {
	private _list = new Map<string, GameRoom>();
	private players = new Set<Player>();
	private static readonly timeoutDelay: number = 3 * 60 * 1000;

	constructor() {}
	get list() {
		return Array.from(this._list);
	}

	public get(roomId: string): GameRoom | undefined {
		return this._list.get(roomId);
	}

	private async callIa(room: GameRoom) {
		console.log("IA REQUESTED");
		try {
			room.register(0, 2);
		} catch (error) {}
		await fetch("https://gate:3005/ia/requestIa", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id: room.id }),
		});
	}

	public createRoom(arg: createRoomData): GameRoom {
		console.log("ROOM REQUEST", arg);
		const { timeout, requestIa, ...data } = arg;
		const id = data.id ?? uuidv4();
		if (this.get(id)) throw new Error(`GameRoom "${id}" already exist`);

		// LOG LES PARTIES CREER POUR AVOIR DES STATISTIQUES ET COMME CA ON A DES STATS DU LOCAL
		sendLog(
			JSON.stringify({
				type: "game",
				mode: data.mode,
				ia: requestIa,
				time: new Date().toISOString(),
			})
		);
		const room = new GameRoom({ ...data, id });
		if (data.mode !== "local" && requestIa === true) this.callIa(room);
		this._list.set(id, room);
		const timeoutDelay = !timeout || timeout <= 0 ? RoomManager.timeoutDelay : timeout;
		this.setRoomEvents(room, timeoutDelay);
		console.debug(`New GameRoom: `, {
			id: room.id,
			mode: room.mode,
			players: room.registeredPlayerList,
		});
		return room;
	}

	private setRoomEvents(room: GameRoom, timeoutDelay: number) {
		let timer: NodeJS.Timeout;
		const cb = () => {
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => {
				if (room.timeStamp + timeoutDelay < Date.now()) {
					room.off("empty", cb);
					room.emit("timeout");
				}
			}, timeoutDelay + 10);
		};
		room.on("empty", cb);
		const timerJoin = setTimeout(() => room.emit("timeout"), timeoutDelay);
		room.once("join", () => clearTimeout(timerJoin));

		room.on("game_end", (e) => {
			console.debug(`GameRoom: "${room.id}" game end`);
			if (room.mode == "remote") {
				const repo = new MatchRepository();
				const state = room.game.getState();
				repo.saveMatchRaw({
					players: room.registeredPlayerList.map((p) => p.id) as [number, number],
					scores: [state.player1.score, state.player2.score],
					winner: e.winner ?? null,
				});
			}
			setTimeout(() => this.deleteRoom(room.id), 1000);
		});
		room.on("timeout", () => {
			console.debug(`GameRoom: "${room.id}" timed out`);
			this.deleteRoom(room.id);
		});
	}

	private deleteRoom(roomId: string): void {
		const room = this.get(roomId);
		if (!room) return;
		room.lock_clean();
		this._list.delete(room.id);
		console.debug(`Deleted GameRoom: "${roomId}"`);
	}

	public join(roomId: string, player: Player): void {
		const room = this.get(roomId);

		if (!room) {
			const msg = `GameRoom "${roomId}" not found`;
			player.send({ type: "error", msg });
			throw new Error(msg);
		}
		return room.join(player);
	}

	public leave(player: Player) {
		player.room?.remove(player);
	}

	public register(player: Player) {
		this.players.add(player);
		player._socket?.on("close", () => this.players.delete(player));
	}

	public async send(playerId: number, msg: ServerMessage) {
		for (const player of this.players) {
			if (player.id === playerId) player.send(msg);
		}
	}

	public async broadcast(msg: ServerMessage) {
		for (const player of this.players) {
			player.send(msg);
		}
	}
}
