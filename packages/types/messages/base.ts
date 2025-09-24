export interface Message {
	type: string;
}

export interface LeaveMessage extends Message {
	type: "leave";
}

export interface ServerMessageBase extends Message {
	id?: number;
}
