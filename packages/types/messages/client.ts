import { Message, LeaveMessage } from "./base";

export type key = "up" | "down" | "up_2" | "down_2";

export interface ClientKeyMessage extends Message {
	type: "keydown" | "keyup";
	key: key;
}

export interface ClientGetMessage extends Message {
	type: "get";
	id: number;
	arg: string;
}

export interface ClientJoinMessage extends Message {
	type: "join";
	roomId: string;
}

export type ClientMessage = ClientKeyMessage | ClientGetMessage | ClientJoinMessage | LeaveMessage;
