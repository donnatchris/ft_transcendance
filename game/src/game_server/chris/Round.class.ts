import  Match from './Match.class.js'
import { Participant } from './Participant.class.js'
import { IMatchRepository } from './IMatchRepository.js'
import { RoundOptions, TournamentInfo, GameStatus, RoundJSON } from './TournamentTypes.js'


export class Round {
	private _repo : IMatchRepository | null;
	private readonly _playersPerMatch: number;
    private readonly _tournament: TournamentInfo | null;
    private _numberOfMatches: number;
    private _matchArray: Match[];
    private _status: GameStatus;
    private _playerArray: (Participant | null)[];
    private _winnerArray: (Participant | null)[];
	private readonly _created_at: Date;
	private _started_at: Date | null;
	private _ended_at: Date | null;
	private _allowDraw: boolean = false;
    
    constructor(numberOfMatches: number, opts?: RoundOptions) {
		this._repo = opts?.repo? opts.repo : null;
		if (numberOfMatches < 1) {
			throw new Error("Invalid number of matches.");
		}
		this._numberOfMatches = numberOfMatches;
		if (opts?.playersPerMatch && opts.playersPerMatch < 1) {
			throw new Error("Invalid number of player per match.");
		}
		this._playersPerMatch = opts?.playersPerMatch? opts.playersPerMatch : 2;
		this._tournament = opts?.tournament? opts.tournament : null;
        this._winnerArray = new Array<Participant | null>(this._numberOfMatches).fill(null);
        this._playerArray = new Array<Participant | null>(this._numberOfMatches * this._playersPerMatch).fill(null);
		if (opts?.playerArray) {
			if (opts.playerArray.length > this._playerArray.length) {
				throw new Error("Too many participants.");
			}
			for (let i = 0; i < opts.playerArray.length; i++) {
				this._playerArray[i] = opts.playerArray[i] ?? null;
			}
		}
        this._status = 'locked';
		this._created_at = new Date();
		this._started_at = null;
		this._ended_at = null;
        this._matchArray = new Array<Match>(this._numberOfMatches);
		this.createMatches();
		this.affectPlayersToMatches();
    }

	private createMatches() {
		for (let matchIndex = 0; matchIndex < this._numberOfMatches; matchIndex++) {
			this._matchArray[matchIndex] = new Match({
				players_perMatch: this._playersPerMatch,
				playerArray: [],
				tournament: this._tournament,
				repo: this._repo,
				allowDraw: this._allowDraw
			});
		}
	}

	private affectPlayersToMatches() {
		for (let matchIndex = 0; matchIndex < this._numberOfMatches; matchIndex++) {
			const base = matchIndex * this._playersPerMatch;
			for (let seat = 0; seat < this._playersPerMatch; seat++) {
				const p = this._playerArray[base + seat];
				if (p) {
					this._matchArray[matchIndex].addPlayer(p);
				}
			}
		}
	}

	public addPlayerToMatch(player: Participant, matchIndex: number, seatIndex? : number) {
		if (this._status !== 'locked') {
				throw new Error("Round has already started.");
		}
		if (!player) {
			throw new Error("Invalid participant.");
		}
		if (matchIndex < 0 || matchIndex >= this._numberOfMatches) {
			throw new Error("Invalid match index.");
		}
		if (this._playerArray.some(p => p?.id === player.id)) {
			throw new Error("Participant already in this round.");
		}
		const base = matchIndex * this._playersPerMatch;
		let seat = seatIndex;
		if (seat === undefined) {
			seat = -1;
			for (let s = 0; s < this._playersPerMatch; s++) {
				if (this._playerArray[base + s] === null) { seat = s; break; }
			}
			if (seat === -1) throw new Error("Selected match is already full.");
		}
		else {
			if (seat < 0 || seat >= this._playersPerMatch) throw new Error("Invalid seat index.");
			if (this._playerArray[base + seat] !== null) throw new Error("Seat already taken in selected match.");
		}
		this._playerArray[base + seat] = player;
		this._matchArray[matchIndex].addPlayer(player);
	}

	public isFull(): boolean {
		return this._playerArray.every(p => p !== null);
	}

	private waitAllDone(): Promise<void> {
		const tick = 200;
		return new Promise<void>((resolve) => {
			const check = () => {
			const allDone = this._matchArray.every(m => m.status === 'done');
			if (allDone) resolve();
			else setTimeout(check, tick);
			};
			check();
		});
	}

	public async start() {
		if (this._status !== 'locked') {
			console.log(`[Game: Round] start: Round has already started or is done.`);
			return;
		}
		if (! this.isFull()) {
			throw new Error("Not enough players to start the round.");
		}
		this._started_at = new Date();
		this._status = 'running';
		console.log(`[Game: Round] start: Starting round matches.`);
		this._matchArray.forEach(match => match.start());
		await this.waitAllDone();
		console.log(`[Game: Round] start: All matches of the round done (after waitAllDone).`);
		this.stop();
	}

	public stop() {
		if (this._status !== 'running') {
			return;
		}
		this._matchArray.forEach(m => m.stop());
		console.log(`[Game: Round] stop: All matches of the round stopped, updating winners.`);
		this.updateWinners();
		const allDone = this._matchArray.every(m => m && m.status === 'done');
		if (allDone) {
			this._status = 'done';
			this._ended_at = new Date();
		}
	}

	private updateWinners() {
		for (let i = 0; i < this._numberOfMatches; i++) {
			this._winnerArray[i] = this._matchArray[i]?.winner ?? null;
		}
	}

    public isFinished(): boolean {
		return this._status === 'done';
    }

    get status(): GameStatus {
        return this._status;
    }

    get tournament(): TournamentInfo | null {
        return this._tournament;
    }
	
	get matchArray(): ReadonlyArray<Match> {
		return [...this._matchArray];
	}

	get winnerArray(): ReadonlyArray<Participant | null> {
		return [...this._winnerArray];
	}

	get playerArray(): ReadonlyArray<Participant | null> {
		return [...this._playerArray];
	}

	get numberOfMatches(): number {
		return this._numberOfMatches;
	}

	get playersPerMatch(): number {
		return this._playersPerMatch;
	}

	get createdAt(): Date {
		return this._created_at;
	}

	get startedAt(): Date | null {
		return this._started_at;
	}

	get endedAt(): Date | null {
		return this._ended_at;
	}

	toJSON(): RoundJSON {	
		return {
			tournament: this._tournament,
			numberOfMatches: this._numberOfMatches,
			playersPerMatch: this._playersPerMatch,
			playerArray: this._playerArray.map(p => p ? p.toJSON() : null),
			winnerArray: this._winnerArray.map(p => p ? p.toJSON() : null),
			status: this._status,
			created_at: this._created_at,
			started_at: this._started_at,
			ended_at: this._ended_at,
			matchArray: this._matchArray.map(m => m.toJSON()),
			allowDraw: this._allowDraw
		};
	}

}
