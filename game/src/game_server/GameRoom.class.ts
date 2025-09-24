import { Player } from "./Player.class.js";
import { EventEmitter } from "events";
import { PongGame } from "./PongGame.class.js";
import { gameMode, ServerMessage } from "@transcendance/types";
import { z } from "zod";
import { GameService } from "../services/Game.service.js";

const playerLimits: Record<gameMode, number> = {
	local: 1,
	remote: 2,
	tournament: 2,
};

const gameModeSchema = z.enum(["local", "remote", "tournament"]);
export const roomSchema = z.object({
	id: z.string(),
	mode: gameModeSchema,
	players: z.union([z.tuple([z.number()]), z.tuple([z.number(), z.number()])]).optional(),
	locked: z.boolean().optional(),
	tournamentId: z.number().optional(),
});
export type roomData = z.infer<typeof roomSchema>;

export type RoomEvent = "join" | "leave" | "empty" | "timeout" | "game_end";
type EventDetailMap = {
	join: { id: number };
	leave: { id: number };
	empty: undefined;
	timeout: undefined;
	game_end: { winner: number | undefined };
};

export class GameRoom {
	public readonly tournamentId;
	private events = new EventEmitter();
	private _timestamp: number = -1;
	private _id: string;
	private _game: PongGame;
	private locked: boolean = false;
	private isEnded: boolean = false;
	private players: {
		registered: { id: number; localId: number }[];
		online: Player[];
	} = { registered: [], online: [] };
	public readonly mode: gameMode;
	public readonly player_limit: number;

	constructor(arg: roomData) {
		const { id, mode, players, tournamentId } = arg;
		this._id = id;
		this.tournamentId = tournamentId;
		this.mode = mode;
		this.player_limit = playerLimits[mode];
		players?.map((p) => {
			try {
				this.register(p);
			} catch (error) {}
		});
		this._game = new PongGame(mode);
		this._game.on("victory", () => this.end());
		this._game.on("timeout", () => this.end());
		setInterval(() => {
			this.send({ type: "state", state: this._game.getState() });
		}, 15);
	}
	public get id() {
		return this._id;
	}
	public get game() {
		return this._game;
	}
	public get playerCount() {
		return this.players.registered.length;
	}
	public get playerList() {
		return this.players.online;
	}
	public get registeredPlayerList() {
		return this.players.registered;
	}
	public get timeStamp() {
		return this._timestamp;
	}
	private updateTimeStamp = () => (this._timestamp = Date.now());
	public lock = () => (this.locked = true);
	public unlock = () => (this.locked = false);

	public on<T extends RoomEvent>(event_type: T, cb: EventDetailMap[T] extends undefined ? () => void : (data: EventDetailMap[T]) => void) {
		this.events.on(event_type, cb);
	}
	public once<T extends RoomEvent>(event_type: T, cb: EventDetailMap[T] extends undefined ? () => void : (data: EventDetailMap[T]) => void) {
		this.events.once(event_type, cb);
	}

	public off<T extends RoomEvent>(event_type: T, cb: EventDetailMap[T] extends undefined ? () => void : (data: EventDetailMap[T]) => void) {
		this.events.off(event_type, cb);
	}

	public emit<T extends RoomEvent>(event_type: T, ...args: EventDetailMap[T] extends undefined ? [] : [data: EventDetailMap[T]]) {
		this.events.emit(event_type, args[0]);
	}

	public register(player: Player, requestedId?: number): number;
	public register(id: number, requestedId?: number): number;
	public register(arg: Player | number, requestedId?: number): number {
		let id: number;
		let player: Player | undefined;
		if (arg instanceof Player) {
			player = arg;
			id = player.id;
		} else {
			id = arg;
		}

		const found_player = this.players.registered.find((p) => p.id === id);
		if (found_player) {
			return found_player.localId;
		} else if (this.players.registered.length >= this.player_limit) {
			const msg = "GameRoom is Full";
			player?.send({ type: "error", msg });
			throw new Error(msg);
		}
		const used = this.players.registered.map((p) => p.localId);
		const availableIds = [1, 2].filter((id) => !used.includes(id));
		if (availableIds.length < 1) {
			const msg = "GameRoom error";
			player?.send({ type: "error", msg });
			throw new Error(msg);
		}
		let localId: number;
		if (requestedId && availableIds.includes(requestedId)) {
			localId = requestedId;
		} else {
			localId = availableIds.shift() as number;
		}
		this.players.registered.push({ id, localId });
		return localId;
	}

	public join(player: Player) {
		if (this.locked) {
			const msg = "GameRoom is locked";
			player.send({ type: "error", msg });
			throw new Error(msg);
		}
		if (this.players.online.find((p) => p.id === player.id)) return;

		player.room?.remove(player);
		const localId = this.register(player);
		player.localId = localId;
		this.players.online.push(player);
		player.room = this;
		this.updateTimeStamp();
		this.emit("join", { id: player.id });
		//this.on("join", (e) => {e.id})
		player.send({
			type: "info",
			data: {
				dims: { width: 800, heigth: 400 },
				mode: this.game.mode,
				playerId: player.localId,
				ended: this.game.isEnded,
			},
		});
		if (this.players.online.length == this.player_limit) {
			this.send({ type: "ready" });
			setTimeout(() => this.start(), 1000);
		}
	}

	public remove(player: Player) {
		this.updateTimeStamp();
		this.players.online = this.players.online.filter((p) => p.id != player.id);
		this.emit("leave", { id: player.id });
		player.send({ type: "leave" });
		if (this.players.online.length == 0) {
			this.emit("empty");
		}
	}

	public lock_clean() {
		this.lock();
		for (const player of this.players.online) {
			this.remove(player);
		}
		this.events.removeAllListeners();
	}

	public start() {
		this._game.start();
	}

	public end() {
		if (this.isEnded) return;
		this.isEnded = true;
		this.game.stop();
		const local_winner = this.game.winner;
		let winner: number | undefined;
		if (local_winner) {
			winner = this.players.registered.find((p) => p.localId)?.id;
		}
		this.send({ type: "info", data: { ended: true } });
		this.emit("game_end", { winner });
		this.lock_clean();
	}

	public async send(msg: ServerMessage) {
		for (const player of this.players.online) {
			player.send(msg);
		}
	}
}
