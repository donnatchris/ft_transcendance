// Game types

export interface Entity {
	x: number;
	y: number;
	speed: number;
}

export interface Ball extends Entity {
	dx: number;
	dy: number;
	size: number;
}

export interface Player extends Entity {
	width: number;
	height: number;
	score: number;
}

export interface gameState {
	player1: Player;
	player2: Player;
	ball: Ball;
}

export type gameMode = "local" | "remote" | "tournament";
export interface gameInfo {
	mode?: gameMode;
	dims?: {
		width: number;
		heigth: number;
	};
	playerId?: number;
	ended: boolean;
}

export type GameEvent = "score" | "victory" | "timeout";
