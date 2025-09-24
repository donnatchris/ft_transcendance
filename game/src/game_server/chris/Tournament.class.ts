import { Participant } from './Participant.class.js'
import { AiGenerator } from './AiGenerator.class.js'
import { Round } from './Round.class.js'
import { IMatchRepository } from './IMatchRepository.js'
import { TournamentOptions, GameStatus, TournamentJSON, RoundPhase } from './TournamentTypes.js'


export class Tournament {
	private _name: string;
	private _repo : IMatchRepository | null;
	private readonly _numberOfRounds: number;
	private readonly _playersPerMatch: number;
	private readonly _playerPerTournament: number;
	private _playerArray: Participant[];
	private _playerArrayForTheRound: Participant[];
	private _status: GameStatus;
	private _winner: Participant | null;
	private _finalRanking: Participant[] | null = null;
	private _currentRound: number;
	private _roundArray: Round[];
	private readonly _created_at: Date;
	private _created_by: Participant | null;
	private _started_at: Date | null;
	private _ended_at: Date | null;
	
	constructor(name: string, opts?: TournamentOptions) {
		this._name = name;
		this._created_by = opts?.created_by? opts.created_by : null;
		this._repo = opts?.repo? opts.repo : null;
		if (opts?.numberOfRounds && opts.numberOfRounds < 1) {
			throw new Error("Invalid number of rounds.");
		}
		this._numberOfRounds = opts?.numberOfRounds? opts?.numberOfRounds : 3;
		if (opts?.playersPerMatch && opts?.playersPerMatch < 1) {
			throw new Error("Invalid number of players per match.");
		}
		this._playersPerMatch = opts?.playersPerMatch? opts.playersPerMatch : 2;
		this._playerPerTournament = Math.pow(this._playersPerMatch, this._numberOfRounds);
		this._playerArray = opts?.playerArray? opts.playerArray : [];
		if (this._playerArray.length > this._playerPerTournament) {
			throw new Error("Too many participants.");
		}
		this._playerArrayForTheRound = [];
		this._status = 'locked';
		this._winner = null;
		this._currentRound = this._numberOfRounds - 1;
		this._roundArray = new Array<Round>(this._numberOfRounds);
		for (let i = 0; i < this._numberOfRounds; i++) {
			let numberOfMatches = Math.pow(2, i);
			this._roundArray[i] = new Round(numberOfMatches, {
				playersPerMatch: this._playersPerMatch,
				playerArray: [],
				repo: this._repo,
				tournament: {
					name: this._name,
					round: i
				}
			});
		}
		this._created_at = new Date();
		this._started_at = null;
		this._ended_at = null;
		this.creationToDb();
	}

	public isFull(): boolean {
		return this._playerArray.length === Math.pow(this._playersPerMatch, this._numberOfRounds);
	}

	public addPlayer(player: Participant) {
		if (this.isFull()) {
			throw new Error("Too many participants.");
		}
		if (this._playerArray.some(p => p.id === player.id)) {
			throw new Error("Participant already registered.");
		}
		this._playerArray.push(player);
	}

	public start() {
		if (this._status !== 'locked') {
			return;
		}
		if (!this.isFull()) {
			this.addAiParticipants();
		}
		this._started_at = new Date();
		this._status = 'running';
		this._playerArrayForTheRound = this.shufflePlayersCopy(this._playerArray);
		this.prepareNextRound();
	}

	private addAiParticipants(): void {
		const aiNeeded = this._playerPerTournament - this._playerArray.length;
		const aiArray = AiGenerator.generateAiArray(aiNeeded);
		const aiParticipants = aiArray.map(ai => Participant.createAi(ai));
		this._playerArray = this._playerArray.concat(aiParticipants);
	}
	
	private shufflePlayersCopy<T>(array: T[]): T[] {
		const copy = [...array];
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}
		return copy;
	}

	private prepareNextRound() {
		if (this.isFinished()) {
			this._playerArrayForTheRound = [];
			return;
		}
		const round = this._roundArray[this._currentRound];
		const playerArray = this._playerArrayForTheRound;
		const totalSlots = round.numberOfMatches * round.playersPerMatch;
		for (let i = 0; i < totalSlots; i++) {
			const p = playerArray[i];
			if (!p) {
				throw new Error(`Missing player at slot ${i} for round ${this._currentRound}`);
			}
			const matchIndex = Math.floor(i / round.playersPerMatch);
			const seatIndex  = i % round.playersPerMatch;
			round.addPlayerToMatch(p, matchIndex, seatIndex);
		}
	}
	
	public async runNewRound() {
		if (this.isFinished()) {
			console.log(`[Game: Tournament] runNewRound: Tournament is over, cannot start a new round.`);
			return;
		}
		console.log(`[Game: Tournament] runNewRound: Starting round ${this._currentRound}.`);
		const round = this._roundArray[this._currentRound];
		await round.start();
		this.stopCurrentRound();
		await new Promise(resolve => setTimeout(resolve, 10000));
		if (!this.isFinished()) {
			await this.runNewRound(); // start next round automatically
		}

	}

	public stopCurrentRound() {
		console.log(`[Game: Tournament] stopCurrentRound: Stopping round ${this._currentRound}.`);
		if (this.isFinished()) {
			console.log(`[Game: Tournament] stopCurrentRound: Tournament is over, no round to stop.`);
			return;
		}
		const round = this._roundArray[this._currentRound];
		round.stop();
		const winners = round.winnerArray;
		if (winners.some(w => w === null)) {
			throw new Error("Some matches in the round are not finished yet.");
		}
		this._currentRound--;
		this.isFinished();
		this._playerArrayForTheRound = winners as Participant[];
		this.prepareNextRound();
	}
	
	public isFinished(): boolean {
		if (this._status === 'done') {
			return true;
		}
		if (this._currentRound < 0) {
			this._status = 'done';
			if (!this._ended_at) {
				this._ended_at = new Date();
			}
			if (!this._winner) {
				this._winner = this._roundArray[0].winnerArray[0];
			}
			this.createRanking();
			console.log(`[Game: Tournament] isFinished: Tournament "${this._name}" is over. Winner: ${this._winner ? this._winner.display_name : 'None'}`);
			this.endToDb();
			return true;
		}
		return false;
	}

	private creationToDb() {
		if (this._repo) {
			try {
				this._repo.saveTournamentCreation(this);
			} catch (err) {
				console.error("Error saving match to database:", err);
			}
		}
	}

	private endToDb() {
		if (this._repo) {
			try {
				this._repo.saveTournamentEnd(this);
			} catch (err) {
				console.error("Error saving match to database:", err);
			}
		}
	}

		private createRanking(): void {
		type Seen = { p: Participant; bestRound: number };
		const seen = new Map<number, Seen>();
		for (let i = 0; i < this._numberOfRounds; i++) {
			for (const match of this._roundArray[i].matchArray) {
				for (const slot of match.playerArray) {
					const p = slot.player;
					if (!p) continue;
					const prev = seen.get(p.id)?.bestRound ?? Number.POSITIVE_INFINITY;
					if (i < prev) seen.set(p.id, { p, bestRound: i });
				}
			}
		}
		const winnerId = this._winner?.id ?? 0;
		const finalMatch = this._roundArray[0]?.matchArray?.[0];
		const finalistIds: number[] =
			finalMatch?.playerArray.map(s => s.player?.id).filter((v): v is number => !!v) ?? [];
		const runnerUpId = finalistIds.find(id => id !== winnerId);
		const ranked = Array.from(seen.values()).sort((a, b) => {
			if (a.p.id === winnerId) return -1;
			if (b.p.id === winnerId) return 1;
			if (a.p.id === (runnerUpId ?? -2)) return -1;
			if (b.p.id === (runnerUpId ?? -2)) return 1;
			if (a.bestRound !== b.bestRound) return a.bestRound - b.bestRound;
			return a.p.id - b.p.id;
		});

		this._finalRanking = ranked.map(x => x.p);
	}

	get name(): string {
		return this._name;
	}

	get playersPerMatch(): number {
		return this._playersPerMatch;
	}

	get numberOfRounds(): number {
		return this._numberOfRounds;
	}

	get playersPerTournament(): number {
		return this._playerPerTournament;
	}

	get currentRound(): number {
		return this._currentRound;
	}

	get playerArray(): Participant[] {
		return this._playerArray;
	}

	get winner(): Participant | null {
		return this._winner;
	}

	get status(): GameStatus {
		this.isFinished();
		return this._status;
	}

	get roundArray(): Round[] {
		return this._roundArray;
	}

	get created_at(): Date {
		return this._created_at;
	}

	get created_by(): Participant | null {
		return this._created_by;
	}

	get started_at(): Date | null {
		return this._started_at;
	}

	get ended_at(): Date | null {
		return this._ended_at;
	}

	public get phase(): RoundPhase {
		switch (this.currentRound) {
		case -1:
			return 'done';
		case 0:
			return 'final';
		case 1:
			return 'semi';
		case 2:
			return 'quarter';
		case 3:
			return 'round of 16';
		default:
			return 'knockout stage';
		}
	}

	get finalRanking(): Participant[] | null {
		return this._finalRanking;
	}

	toJSON(): TournamentJSON {
		return {
			name: this._name,
			phase: this.phase,
			playersPerMatch: this._playersPerMatch,
			numberOfRounds: this._numberOfRounds,
			playersPerTournament: this._playerPerTournament,
			playerArray: this._playerArray.map(p => p.toJSON()),
			currentRound: this._currentRound,
			winner: this._winner? this._winner.toJSON() : null,
			status: this.status,
			created_by: this._created_by? this._created_by.toJSON() : null,
			created_at: this._created_at,
			started_at: this._started_at,
			ended_at: this._ended_at,
			roundArray: this._roundArray.map(r => r.toJSON()),
			finalRanking: this._finalRanking ? this._finalRanking.map(p => p.toJSON()) : null
		};
	}

}
