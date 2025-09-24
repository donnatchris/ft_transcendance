import { Participant } from "./Participant.class.js";
import { IMatchRepository } from "./IMatchRepository.js";
import { PlayerNScore, MatchOptions, TournamentInfo, GameStatus, MatchJSON } from "./TournamentTypes.js";
import { manager as roomManager } from "../server.js";
import { GameRoom } from "../GameRoom.class.js";
import { randomUUID } from "crypto";
import { ServerMessage } from "@transcendance/types";

class Match {
	private repo: IMatchRepository | null;
	private readonly _tournament: TournamentInfo | null;
	private readonly _playersPerMatch: number;
	private _playerArray: PlayerNScore[];
	private _status: GameStatus;
	private _winner: Participant | null;
	private readonly _created_at: Date;
	private _started_at: Date | null;
	private _ended_at: Date | null;
	private _allowDraw: boolean;
	private readonly _matchId: string;
	private _room: GameRoom | null;

	constructor(opts?: MatchOptions) {
		this._matchId = randomUUID();
		this._room = null;
		this.repo = opts?.repo ? opts.repo : null;
		this._tournament = opts?.tournament ? opts.tournament : null;
		if (opts?.players_perMatch && opts?.players_perMatch < 1) {
			throw new Error("Invalid number of max players.");
		}
		this._playersPerMatch = opts?.players_perMatch ? opts.players_perMatch : 2;
		if (opts?.playerArray && opts.playerArray.length > this._playersPerMatch) {
			throw new Error("Too many participants.");
		}
		this._playerArray = [];
		if (opts?.playerArray) {
			for (let i = 0; i < opts.playerArray.length; i++) {
				this._playerArray[i] = { player: opts.playerArray[i], score: 0 };
			}
		}
		this._status = "locked";
		this._winner = null;
		this._created_at = new Date();
		this._started_at = null;
		this._ended_at = null;
		this._allowDraw = opts?.allowDraw ?? false;
	}

	public isFull(): boolean {
		return this._playerArray.length >= this._playersPerMatch;
	}

	public addPlayer(player: Participant) {
		if (this._status !== "locked") {
			throw new Error("Match has already started.");
		}
		if (this.isFull()) {
			throw new Error("Too many participants.");
		}
		if (!player) {
			throw new Error("Invalid participant.");
		}
		if (this._playerArray.some((ps) => ps.player.id === player.id)) {
			throw new Error("Participant already in this match.");
		}
		this._playerArray.push({ player: player, score: 0 });
	}

	public start() {
		if (this._status !== "locked") {
			throw new Error("Match has already started.");
		}
		if (this._room) {
			throw new Error("Game room for this match already exists.");
		}
		if (!this.isFull()) {
			throw new Error("Not enough players to start the match.");
		}
		console.log(
			`[Game: Match] start: Starting match ${this._matchId} with players:`,
			this._playerArray.map((ps) => ps.player.display_name)
		);
		this._status = "running";
		this._started_at = new Date();
		this.manageRoom();
	}

	private manageRoom() {
		if (this._playerArray.length !== 2) {
			throw new Error("Room can only be created for 2 players matches.");
		}
		if (this._playerArray[0].player.isAi && this._playerArray[1].player.isAi) {
			this.stop();
			return;
		}
		const room = roomManager.createRoom({
			id: this._matchId,
			mode: "tournament",
			players: this.playerArray.map((p) => (p.player.isAi ? 0 : p.player.id)) as [number, number],
			locked: true,
			requestIa: this.playerArray.some((p) => p.player.isAi),
		});
		this._room = room;
		const msg1: ServerMessage = {
			type: "join",
			room_id: this._room.id,
		};
		this._playerArray.map((p) => p.player.id >= 0 && roomManager.send(p.player.id, msg1));

		this._room.game.start();
		this._room.game.on("score", (data) => {
			const { score1, score2 } = data as { score1: number; score2: number };
			this.setScoreByIndex(0, score1);
			this.setScoreByIndex(1, score2);
		});
		this._room.on("game_end", () => this.stop());
	}

	public incrementScoreByIndex(index: number) {
		if (this._status !== "running") {
			return;
			//throw new Error("Match is not running.");
		}
		if (index < 0 || index >= this._playerArray.length) {
			throw new Error("Invalid player index.");
		}
		this._playerArray[index].score++;
	}

	public incrementScoreByPlayerId(playerId: number) {
		const i = this._playerArray.findIndex((ps) => ps.player.id === playerId);
		if (i === -1) {
			throw new Error("Player not found in match.");
		}
		this.incrementScoreByIndex(i);
	}

	public setScoreByIndex(index: number, value: number) {
		if (this._status !== "running") {
			return;
			//throw new Error("Match is not running.");
		}
		if (index < 0 || index >= this._playerArray.length) {
			throw new Error("Invalid player index.");
		}
		if (!Number.isFinite(value) || value < 0) {
			throw new Error("Invalid score value.");
		}
		this._playerArray[index].score = Math.floor(value);
	}

	public setScoreByPlayerId(playerId: number, value: number) {
		const i = this._playerArray.findIndex((ps) => ps.player.id === playerId);
		if (i === -1) {
			throw new Error("Player not found in match.");
		}
		this.setScoreByIndex(i, value);
	}

	public stop() {
		if (this._status !== "running") {
			return;
		}
		this._status = "done";
		this._ended_at = new Date();
		const max = Math.max(...this._playerArray.map((ps) => ps.score));
		const leaders = this._playerArray.filter((ps) => ps.score === max);
		if (leaders.length > 1) {
			if (this._allowDraw) {
				this._winner = null;
			} else {
				const randomIndex = Math.floor(Math.random() * leaders.length);
				this._winner = leaders[randomIndex].player;
			}
		} else if (leaders.length === 1) {
			this._winner = leaders[0].player;
		} else {
			this._winner = null;
		}
		if (this._room) {
			this._room.end();
			this._room = null;
		}
		void this.resultsToDb();
	}

	private async resultsToDb() {
		if (this.repo) {
			try {
				await this.repo.saveMatch(this);
			} catch (err) {
				console.error("Error saving match to database:", err);
			}
		}
	}

	public get playerArray(): PlayerNScore[] {
		return this._playerArray.map((ps) => ({ player: ps.player, score: ps.score }));
	}

	public get status(): GameStatus {
		return this._status;
	}

	public get numberOfPlayers(): number {
		return this._playerArray.length;
	}

	public get winner(): Participant | null {
		return this._winner;
	}

	public get players_perMatch(): number {
		return this._playersPerMatch;
	}

	public get created_at(): Date {
		return this._created_at;
	}

	public get started_at(): Date | null {
		return this._started_at;
	}

	public get ended_at(): Date | null {
		return this._ended_at;
	}

	public get tournament(): TournamentInfo | null {
		return this._tournament;
	}

	public get phase(): string {
		if (!this._tournament) {
			return "friendly";
		}
		switch (this._tournament.round) {
			case 0:
				return "final";
			case 1:
				return "semi";
			case 2:
				return "quarter";
			case 3:
				return "round of 16";
			default:
				return "knockout stage";
		}
	}

	toJSON(): MatchJSON {
		return {
			tournament: this._tournament,
			playersPerMatch: this._playersPerMatch,
			playerArray: this._playerArray.map((ps) => ({
				player: ps.player.toJSON(),
				score: ps.score,
			})),
			status: this._status,
			winner: this._winner ? this._winner.toJSON() : null,
			created_at: this._created_at,
			started_at: this._started_at,
			ended_at: this._ended_at,
			allowDraw: this._allowDraw,
		};
	}
}

export default Match;
