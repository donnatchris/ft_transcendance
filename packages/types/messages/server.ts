import { gameState, gameInfo, gameMode } from "../game";
import { ServerMessageBase, LeaveMessage } from "./base";

export interface GameRoomInfo {
	id: string;
	mode: gameMode;
	players: { id: number; localId: number }[];
	max: number;
}

// Messages envoyés par le serveur
export interface ServerStateMessage extends ServerMessageBase {
	type: "state";
	state: gameState;
}

export interface ServerInfoMessage extends ServerMessageBase {
	type: "info";
	data: gameInfo;
}

export interface ServerErrorMessage extends ServerMessageBase {
	type: "error";
	msg: string;
}

export interface ServerJoinMessage extends ServerMessageBase {
	type: "join";
	room_id: string;
}

export interface ServerReadyMessage extends ServerMessageBase {
	type: "ready";
}

export type ServerMessage = ServerStateMessage | ServerInfoMessage | ServerErrorMessage | ServerJoinMessage | ServerReadyMessage | LeaveMessage;
