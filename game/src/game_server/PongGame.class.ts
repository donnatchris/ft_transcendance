import type { Entity as EntityType, Ball as BallType, Player as PlayerType, gameState, GameEvent, gameMode, key } from "@transcendance/types";
import { EventEmitter } from "events";
import { Timer } from "./Timer.class.js";

abstract class Entity implements EntityType {
	protected _x: number;
	protected _y: number;
	protected _speed: number;

	public get x(): number {
		return this._x;
	}
	public get y(): number {
		return this._y;
	}
	public get speed(): number {
		return this._speed;
	}

	constructor(x: number, y: number) {
		this._x = x;
		this._y = y;
		this._speed = 1;
	}
}

export class Ball implements BallType {
	static readonly defaultSpeed = 4;
	static readonly defaultSize = 10;
	private readonly base_x: number;
	private readonly base_y: number;
	x: number = 0;
	y: number = 0;
	dx: number = 0;
	dy: number = 0;
	size: number = Ball.defaultSpeed;
	speed: number = Ball.defaultSize;

	constructor(x: number, y: number) {
		this.base_x = x;
		this.base_y = y;
		this.x = x;
		this.y = y;
	}

	public move(t: number = 1): void {
		this.x += this.dx * t;
		this.y += this.dy * t;
	}

	public bounce(player: Paddle) {
		this.speedUp();
		this.dx = -this.dx;
		const relativeY = (this.y - player.y) / (player.height / 2);

		const maxBounceAngle = Math.PI / 4; // 45° max
		this.dy = this.speed * Math.sin(relativeY * maxBounceAngle);
		this.dx = Math.sign(this.dx) * this.speed * Math.cos(relativeY * maxBounceAngle);
	}

	public speedUp() {
		this.speed = Math.min(this.speed * 1.1, 15);
	}

	public vhit(height: number): boolean {
		if (this.y - this.size <= 0 || this.y + this.size >= height) {
			this.dy = -this.dy;
			return true;
		}
		return false;
	}

	public hhit<T>(width: number, cb: (player: T) => void, player1: T, player2: T) {
		let p: T | null = null;
		if (this.x < 0) {
			p = player2;
		} else if (this.x > width) {
			p = player1;
		}
		if (p) cb(p);
	}

	public reset() {
		this.x = this.base_x;
		this.y = this.base_y;
		this.speed = Ball.defaultSpeed;
		this.size = Ball.defaultSize;
		this.dy = 0;
		this.dx = (Math.random() > 0.5 ? 1 : -1) * this.speed;
	}
}

export class Paddle implements PlayerType {
	private readonly base_y: number;
	x: number = 0;
	y: number = 0;
	dy: number = 0;
	width: number = 10;
	height: number = 80;
	speed: number = 5;
	score: number = 0;

	constructor(x: number, y: number) {
		this.base_y = y;
		this.x = x;
		this.y = y;
	}

	public collide(ball: Ball): Boolean {
		return (
			ball.x - ball.size <= this.x + this.width / 2 &&
			ball.x + ball.size >= this.x - this.width / 2 &&
			ball.y - ball.size <= this.y + this.height / 2 &&
			ball.y + ball.size >= this.y - this.height / 2
		);
	}

	public move(height_limit: number, t: number = 1) {
		const y = this.y + this.dy * this.speed * t;
		if (y - this.height / 2 > 0 && y + this.height / 2 < height_limit) {
			this.y = y;
		}
	}

	public reset() {
		this.y = this.base_y;
	}
}

type GameEventDetailMap = {
	timeout: undefined;
	victory: { winner: number | undefined };
	score: { score1: number; score2: number };
};

type rkey = Exclude<key, `${string}_2`>;
const directions: [rkey, number][] = [
	["up", -1],
	["down", 1],
];

export class PongGame {
	public static readonly scoreLimit: number = 5;
	private readonly _mode: gameMode;
	private events: EventEmitter = new EventEmitter();
	private _winner?: number;
	private timeoutTimer = new Timer(2 * 60); // Time Limit
	private isRunning: boolean = false;
	private ended: boolean = false;
	private width: number = 800;
	private height: number = 400;
	private ball: Ball;
	private players: Paddle[] = [];
	private inputs: { [K in rkey]: { state: boolean; t: number } }[] = [];
	private update_interval?: NodeJS.Timeout;
	private _startedAt?: number;
	private _endedAt?: number;

	constructor(mode: gameMode = "remote") {
		this._mode = mode;
		this.ball = new Ball(this.width / 2, this.height / 2);
		this.ball.reset();

		this.players[0] = new Paddle(50, this.height / 2);
		this.players[1] = new Paddle(this.width - 50, this.height / 2);
		this.inputs = [
			{ up: { state: false, t: 0 }, down: { state: false, t: 0 } },
			{ up: { state: false, t: 0 }, down: { state: false, t: 0 } },
		];
		this.timeoutTimer.on("end", () => this.timeout());
	}

	public get isEnded(): boolean {
		return this.ended;
	}

	public get mode(): gameMode {
		return this._mode;
	}

	public get winner(): number | undefined {
		return this._winner;
	}

	public get startedAt(): number | undefined {
		return this._startedAt;
	}
	public get endedAt(): number | undefined {
		return this._endedAt;
	}

	public on<T extends GameEvent>(event: T, listener: (data: GameEventDetailMap[T]) => void): void {
		this.events.on(event, listener as (...args: any[]) => void);
	}

	public emit<T extends GameEvent>(event: T, ...args: GameEventDetailMap[T] extends undefined ? [] : [data: GameEventDetailMap[T]]): void {
		this.events.emit(event, ...args);
	}

	public start(): void {
		this.timeoutTimer.start();
		if (this.update_interval) return;
		this.update_interval = setInterval(() => this.update(), 15);
		this.isRunning = true;
	}

	public stop(): void {
		if (this.update_interval) {
			clearInterval(this.update_interval);
			this.update_interval = undefined;
		}
		this.isRunning = false;
	}

	private timeout(): void {
		this.stop();
		this.emit("timeout");
	}

	public remake(): void {
		this.stop();
		this.reset();
		this.players.map((p) => {
			p.score = 0;
			p.y = this.height / 2;
		});
		this.start();
	}

	private reset() {
		this.players.map((p) => p.reset());
		this.ball.reset();
	}

	public registerInput(playerId: number, key: key, duration: number = 1000) {
		this.setInput(playerId, key, true, duration);
	}

	public removeInput(playerId: number, key: key) {
		this.setInput(playerId, key, false, 0);
	}

	private setInput(playerId: number, key: key, state: boolean, duration: number) {
		if (this._mode == "local") {
			playerId = key.endsWith("_2") ? 1 : 0;
		}
		switch (key) {
			case "up":
			case "up_2":
				this.inputs[playerId]["up"].state = state;
				this.inputs[playerId]["up"].t = duration;
				break;
			case "down":
			case "down_2":
				this.inputs[playerId]["down"].state = state;
				this.inputs[playerId]["down"].t = duration;
				break;
		}
	}

	private movePlayers(): void {
		this.players.forEach((p, index) => {
			let dy = 0;

			for (const [dir, delta] of directions) {
				const input = this.inputs[index][dir];
				if (input.state && input.t > 0) {
					input.t -= 15;
					dy += delta;
				}
			}

			p.dy = dy;
			p.move(this.height);
		});
	}

	private moveBall(): void {
		this.ball.move();
		this.ball.vhit(this.height);
		this.ball.hhit(this.width, (player: Paddle) => this.incrementScore(player), this.players[0], this.players[1]);
	}

	private handlePaddleCollision(player: Paddle, condition: boolean): void {
		if (!condition || !player.collide(this.ball)) return;
		this.ball.bounce(player);
	}

	private incrementScore(player: Paddle): void {
		this.stop();
		this.reset();
		player.score++;
		this.emit("score", { score1: this.players[0].score, score2: this.players[1].score });
		if (player.score >= PongGame.scoreLimit) {
			this._winner = this.players.indexOf(player) + 1;
			setTimeout(() => this.emit("victory", { winner: this.winner }), 50);
			return;
		}
		this.emit("score", { score1: this.players[0].score, score2: this.players[1].score });
		setTimeout(() => this.start(), 600);
	}

	private update(): void {
		if (!this.isRunning) return;
		this.moveBall();
		this.movePlayers();
		this.handlePaddleCollision(this.players[0], this.ball.dx < 0);
		this.handlePaddleCollision(this.players[1], this.ball.dx > 0);
	}

	public getState(): gameState {
		return {
			player1: this.players[0],
			player2: this.players[1],
			ball: this.ball,
		};
	}
}
