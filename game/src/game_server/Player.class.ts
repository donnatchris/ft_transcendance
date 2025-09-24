import { WebSocket } from "@fastify/websocket";
import { GameRoom } from "./GameRoom.class.js";
import { ServerMessage } from "@transcendance/types";

export class Player {
	private _id: number;
	private _localId: number | null = null;
	public _socket?: WebSocket;
	private _room: GameRoom | null = null;

	constructor(id: number, socket?: WebSocket) {
		this._id = id;
		if (!socket) return;
		this._socket = socket;
		socket.on("close", () => {
			this.room?.remove(this);
		});
	}
	public get id(): number {
		return this._id;
	}
	public get localId(): number | null {
		return this._localId;
	}

	public set localId(id: number | null) {
		this._localId = id;
	}
	public get room(): GameRoom | null {
		return this._room;
	}
	public set room(room: GameRoom) {
		this._room = room;
	}
	public async send(msg: ServerMessage) {
		this._socket?.send(JSON.stringify(msg));
	}
}
