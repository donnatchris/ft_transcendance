import { WebSocket } from "ws";
import { IMatchRepository } from "./IMatchRepository.js";
import { Participant } from "./Participant.class.js";

export type RoundPhase = 'done' | 'friendly' | 'knockout stage' | 'round of 16' | 'quarter' | 'semi' | 'final';

export type GameStatus = 'locked' | 'running' | 'done';

export type TournamentInfo = {
	name: string,
	round: number
}

export type HumanPlayer = {
	id_user: number;
	display_name: string;
	avatar?: string | null;
}

export type  AIPlayer = {
	id: number;
	name: string;
}

export type ParticipantOptions = {
	socket?: WebSocket;
}

export type PlayerNScore = {
	player: Participant,
	score: number
}

export type MatchOptions = {
	players_perMatch?: number;
	playerArray?: Participant[] | [];
	tournament?: TournamentInfo | null;
	allowDraw?: boolean;
	repo?: IMatchRepository | null;
}

export type RoundOptions = {
	playersPerMatch?: number;
	playerArray?: Participant[];
	tournament?: TournamentInfo;
	repo?: IMatchRepository | null;
}

export type TournamentOptions = {
	playersPerMatch?: number;
	playerArray?: Participant[] | [];
	numberOfRounds?: number;
	created_by?: Participant | null;
	repo?: IMatchRepository | null;
}

export type ParticipantJSON = {
	id: number;
	display_name: string;
	avatar: string | null;
	isAi: boolean;
}

export type MatchJSON = {
	tournament: TournamentInfo | null;
	playersPerMatch: number;
	playerArray: { player: ParticipantJSON | null, score: number }[];
	status: GameStatus;
	winner: ParticipantJSON | null;
	created_at: Date;
	started_at: Date | null;
	ended_at: Date | null;
	allowDraw: boolean;
}

export type RoundJSON = {
	tournament: TournamentInfo | null;
	numberOfMatches: number;
	playersPerMatch: number;
	matchArray: MatchJSON[];
	status: GameStatus;
	playerArray: (ParticipantJSON | null)[];
	winnerArray: (ParticipantJSON | null)[];
	created_at: Date;
	started_at: Date | null;
	ended_at: Date | null;
	allowDraw: boolean;
}

export type TournamentJSON = {
	name: string;
	phase: RoundPhase;
	created_by: ParticipantJSON | null;
	numberOfRounds: number;
	playersPerMatch: number;
	playersPerTournament: number;
	playerArray: ParticipantJSON[];
	status: GameStatus;
	winner: ParticipantJSON | null;
	currentRound: number;
	roundArray: RoundJSON[];
	created_at: Date;
	started_at: Date | null;
	ended_at: Date | null;
	finalRanking: ParticipantJSON[] | null;
}
