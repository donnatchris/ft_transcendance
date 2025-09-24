import type { Ball, Player, gameState, GameEvent, key, ClientMessage, ServerMessage, gameMode, gameInfo, GameRoomInfo, ServerInfoMessage } from "@transcendance/types";

const DRAW_COLOR = "#ffff00";
const DRAW_BORDER_COLOR = "#ffffff";
const DRAW_PLAYER_COLOR = "#ffff00";
const DRAW_BALL_COLOR = "#ffff00";

type RemoteEvent = GameEvent | "error" | "join_request" | "ready";
type AppEvent = RemoteEvent;

type EventDetailMap = {
	timeout: undefined;
	victory: { winner: boolean | null };
	score: { score1: number; score2: number };
	error: { msg: string };
	join_request: { room_id: string };
	ready: undefined;
};
const host = window.location.host;

class RemoteGame {
	private events: EventTarget;
	private _playerID: number | undefined;
	private lastState: gameState = {
		ball: { x: 0, y: 0, dx: 0, dy: 0, size: 0, speed: 0 },
		player1: { x: 0, y: 0, width: 0, height: 0, speed: 0, score: 0 },
		player2: { x: 0, y: 0, width: 0, height: 0, speed: 0, score: 0 },
	};
	private socket!: WebSocket;

	private get socketIsOpen(): Promise<boolean> {
		return new Promise((resolve) => {
			if (this.socket.readyState === WebSocket.OPEN) {
				return resolve(true);
			}

			const onOpen = () => {
				clearTimeout(timer);
				this.socket.removeEventListener("open", onOpen);
				resolve(true);
			};

			const timer = setTimeout(() => {
				this.socket.removeEventListener("open", onOpen);
				resolve(false);
			}, 2000);

			this.socket.addEventListener("open", onOpen);
		});
	}
	private socketError: boolean = false;
	private socketRetry: number = 0;

	public get playerId(): number | undefined {
		return this._playerID;
	}

	constructor() {
		this.events = new EventTarget();
		this.connect();
	}

	public connect(): void {
		try {
			this.socket = new WebSocket(`wss://${host}/gamews/ws`);
		} catch (error) {
			return this.tryReconnect();
		}

		this.socket.addEventListener("open", () => (this.socketRetry = 0));
		this.socket.addEventListener("error", (e) => (this.socketError = true));
		this.socket.addEventListener("close", () => this.tryReconnect());
		this.socket.addEventListener("message", (event) => this.handleMessage(event));
	}
	private tryReconnect() {
		if (this.socketRetry++ < 5) {
			setTimeout(() => this.connect(), 2000);
		} else {
			// connection timeout
		}
	}
	public on<T extends RemoteEvent>(event_type: T, cb: (data: EventDetailMap[T]) => void): void {
		this.events.addEventListener(event_type, (event: Event) => {
			const customEvent = event as CustomEvent;
			cb(customEvent.detail);
		});
	}

	private emit<T extends RemoteEvent>(event_type: T, ...args: EventDetailMap[T] extends undefined ? [] : [data: EventDetailMap[T]]): void {
		const detail = args[0];
		this.events.dispatchEvent(new CustomEvent(event_type, { detail }));
	}

	private handleMessage(event: MessageEvent<any>) {
		try {
			const msg: ServerMessage = JSON.parse(event.data);
			switch (msg.type) {
				case "state":
					return (this.lastState = msg.state);
				case "info":
					return this.handleInfoMsg(msg);
				case "error":
					return this.emit("error", { msg: msg.msg });
				case "leave":
					break;
				case "join":
					return this.emit("join_request", { room_id: msg.room_id });
				case "ready":
					return this.emit("ready");
			}
		} catch (error) {}
	}

	private handleInfoMsg(msg: ServerInfoMessage) {
		const { playerId, ended } = msg.data;
		if (playerId) this._playerID = playerId;
		if (ended) {
			const state = this.lastState;
			const score1 = state.player1.score;
			const score2 = state.player2.score;
			let winner = null;
			if (score1 !== score2) {
				winner = score1 > score2;
				if (playerId != 1) winner = !winner;
			}
			this.emit("victory", { winner });
		}
		console.log(msg.data);
	}

	private async send(msg: ClientMessage): Promise<void> {
		if (!(await this.socketIsOpen)) return;

		const payload = JSON.stringify(msg);
		this.socket.send(payload);
	}

	public sendInput(key: key, keydown: boolean = true): void {
		this.send({ type: keydown ? "keydown" : "keyup", key });
	}

	public getState(): gameState {
		return this.lastState;
	}

	public join(roomId: string) {
		this.send({ type: "join", roomId });
	}

	public leave() {
		this.send({ type: "leave" });
	}
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiFetchOptions {
	method?: HttpMethod;
	body?: any;
}

function findKeyByValue<T extends Record<string, string>>(obj: T, value: string): keyof T | undefined {
	return (Object.keys(obj) as (keyof T)[]).find((k) => obj[k] === value);
}

export class PongApp {
	private events: EventTarget;
	private _canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private game: RemoteGame;
	private gameRunning: boolean = false;
	private animationId: number | null = null;
	private keyState: { [key: string]: boolean } = {};
	private keyMap = { up: "KeyW", down: "KeyS", up_2: "ArrowUp", down_2: "ArrowDown" };

	private score1: number = 0;
	private score2: number = 0;
	private playerId: number = 0;

	public get canvas(): HTMLCanvasElement {
		return this._canvas;
	}
	public get side(): "left" | "right" {
		return this.game.playerId == 2 ? "right" : "left";
	}

	constructor() {
		this._canvas = document.createElement("canvas");
		this._canvas.width = 800;
		this._canvas.height = 400;
		const context = this._canvas.getContext("2d");
		if (!context) {
			throw new Error("PongApp failed to create a new canvas");
		}
		this.ctx = context;

		this.events = new EventTarget();
		this.game = new RemoteGame();

		this.setupEventListeners();
		this.handleResize();

		this.draw();
		this.start();
		setInterval(() => {
			this.sendInputs();
		}, 800);
	}

	public on<T extends AppEvent>(event_type: T, cb: (data: EventDetailMap[T]) => void): void {
		this.events.addEventListener(event_type, (event: Event) => {
			const customEvent = event as CustomEvent;
			cb(customEvent.detail);
		});
	}

	private emit<T extends AppEvent>(event_type: T, ...args: EventDetailMap[T] extends undefined ? [] : [data: EventDetailMap[T]]): void {
		const detail = args[0];
		this.events.dispatchEvent(new CustomEvent(event_type, { detail }));
	}

	private setupEventListeners(): void {
		const handleKeyEvent = (e: KeyboardEvent, down: boolean) => {
			if (e.repeat) return;
			this.keyState[e.code] = down;
			const key = findKeyByValue(this.keyMap, e.code);
			if (key) this.game.sendInput(key, down);
		};
		document.addEventListener("keydown", (e) => handleKeyEvent(e, true), { passive: true });
		document.addEventListener("keyup", (e) => handleKeyEvent(e, false), { passive: true });
		window.addEventListener("resize", () => this.handleResize());

		this.game.on("victory", (e) => this.emit("victory", e));
		this.game.on("error", (e) => this.emit("error", e));
		this.game.on("join_request", (e) => {
			this.emit("join_request", e);
			this.join(e.room_id);
		});
		this.game.on("ready", () => this.emit("ready"));
	}

	private key(key: keyof typeof this.keyMap): boolean {
		const key_string = this.keyMap[key];
		return this.keyState ? this.keyState[key_string] : false;
	}

	private updateScore(): void {
		const { player1, player2 } = this.game.getState();
		if (this.score1 != player1.score || this.score2 != player2.score) {
			this.emit("score", { score1: player1.score, score2: player2.score });
		}
		this.score1 = player1.score;
		this.score2 = player2.score;
	}

	private start(): void {
		this.gameRunning = true;
		this.gameLoop();
	}

	private stop(): void {
		this.gameRunning = false;
		if (this.animationId) cancelAnimationFrame(this.animationId);
	}

	private sendInputs() {
		this.key("up") && this.game.sendInput("up");
		this.key("down") && this.game.sendInput("down");
		this.key("up_2") && this.game.sendInput("up_2");
		this.key("down_2") && this.game.sendInput("down_2");
	}

	private gameLoop(): void {
		if (!this.gameRunning) return;
		this.updateScore();
		this.draw();
		if (this.gameRunning) {
			this.animationId = requestAnimationFrame(() => this.gameLoop());
		}
	}

	private drawPlayer(player: Player): void {
		this.ctx.fillStyle = DRAW_PLAYER_COLOR;
		this.ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
	}

	private drawBall(ball: Ball): void {
		this.ctx.fillStyle = DRAW_BALL_COLOR;
		this.ctx.beginPath();
		this.ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
		this.ctx.fill();
	}

	private drawBg(): void {
		// Draw center line
		this.ctx.setLineDash([10, 10]);
		this.ctx.strokeStyle = DRAW_COLOR;
		this.ctx.lineWidth = 10;
		this.ctx.beginPath();
		this.ctx.moveTo(this._canvas.width / 2, 0);
		this.ctx.lineTo(this._canvas.width / 2, this._canvas.height);
		this.ctx.stroke();
		this.ctx.setLineDash([]);

		// Draw borders
		this.ctx.strokeStyle = DRAW_BORDER_COLOR;
		this.ctx.lineWidth = 1;
		this.ctx.setLineDash([1, 7]);
		this.ctx.strokeRect(this.ctx.lineWidth / 1, this.ctx.lineWidth / 1, this._canvas.width - this.ctx.lineWidth, this._canvas.height - this.ctx.lineWidth);
	}

	private draw(): void {
		this.ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		const { player1, player2, ball } = this.game.getState();
		this.drawPlayer(player1);
		this.drawPlayer(player2);
		this.drawBall(ball);
		this.drawBg();
	}

	private handleResize(): void {
		const container = this._canvas.parentElement;
		if (container == null) return;
		const maxWidth = Math.min(800, container.clientWidth - 40);
		const aspectRatio = 800 / 400;

		if (maxWidth < 800) {
			this._canvas.style.width = maxWidth + "px";
			this._canvas.style.height = maxWidth / aspectRatio + "px";
		} else {
			this._canvas.style.width = "800px";
			this._canvas.style.height = "400px";
		}
	}

	async apiFetch<T>(path: string = "/", options?: ApiFetchOptions): Promise<T | undefined> {
		const { method = "GET", body } = options ?? {};
		const headers: Record<string, string> = {};
		if (body !== undefined) {
			headers["Content-Type"] = "application/json";
		}
		const url = new URL(path.replace(/^\/+/, ""), `https://${host}/gate/game/`).toString();
		const res = await fetch(url, {
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined,
		});
		try {
			return await res.json();
		} catch (error) {
			return undefined;
		}
	}
	public async listGame(): Promise<string> {
		return (await this.apiFetch("/")) ?? "";
	}

	public async newGame(mode: gameMode, requestIa: boolean = false, roomId?: string) {
		return await this.apiFetch<{ id: string }>("/", {
			method: "POST",
			body: {
				mode,
				...(requestIa && { requestIa }),
				...(roomId && { id: roomId }),
			},
		});
	}

	public async getGame(roomId: string): Promise<GameRoomInfo | undefined> {
		return await this.apiFetch<GameRoomInfo>(`/${roomId}`, {
			method: "GET",
		});
	}

	public join(roomId: string): void {
		this.game.join(roomId);
	}

	public leave(): void {
		this.game.leave();
	}

	public async joinLocal() {
		return this.newGame("local")
			.then((e) => {
				e && this.join(e.id);
			})
			.catch((e) => {
				this.emit("error", { msg: "" });
			});
	}

	public async joinIa() {
		await this.newGame("remote", true)
			.then((e) => {
				e && this.join(e.id);
			})
			.catch((e) => {
				this.emit("error", { msg: "" });
			});
	}

	public reconnect = () => this.game.connect();
}
