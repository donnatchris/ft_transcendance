import { WebSocket } from "ws";
import { AiGenerator } from "./AiGenerator.class.js";
import { HumanPlayer, AIPlayer, ParticipantOptions, ParticipantJSON } from "./TournamentTypes.js";


export class Participant {
	private readonly _id: number;
	private readonly _display_name: string;
	private readonly _avatar: string | null;
	private readonly _isAi: boolean;
	private readonly _socket: WebSocket | null | undefined;

	private constructor(user: { id_user: number, display_name: string, avatar?: string | null }, isAi: boolean, socket?: WebSocket | null | undefined) {
		this._socket = socket? socket : null;
		// this._socket = socket? socket : new WebSocket('wss://game:3002/ws');
		this._id = user.id_user;
		this._display_name = user.display_name;
		this._avatar = user.avatar ?? null;
		this._isAi = isAi? isAi: false;
	}

	static createFromUser(user?: HumanPlayer, opts?: ParticipantOptions) {
		const u = user? user : { id_user: 0, display_name: "[Unknown]", avatar: null };
		return new Participant(u, false, opts?.socket? opts.socket : null);
	}

	static createAi(ai?: AIPlayer, opts?: ParticipantOptions) {
		if (!ai) {
			const aiPlayer =  AiGenerator.generateOneAi();
			return new Participant({ id_user: aiPlayer.id, display_name: aiPlayer.name, avatar: null } , true, opts?.socket);
		}
		return new Participant({ id_user: ai.id, display_name: ai.name, avatar: null } , true, opts?.socket ? opts.socket : null);
	}

	get id(): number {
		return this._id;
	}

	get display_name(): string {
		return this._display_name;
	}

	get avatar(): string | null {
		return this._avatar;
	}

	get isAi(): boolean {
		return this._isAi;
	}

	get socket(): WebSocket | null | undefined {
		return this._socket;
	}

	toJSON(): ParticipantJSON {
		return {
			id: this._id,
			display_name: this._display_name,
			avatar: this._avatar,
			isAi: this._isAi,
		};
	}

}
