const IA_KEY = process.env.IA_KEY

import WebSocket from 'ws';
import type { 
  ServerMessage, 
  gameState, 
  Ball, 
  key, 
  ClientKeyMessage, 
  ClientJoinMessage, 
  Player
} from '@transcendance/types';

const SERVER_URL = "wss://game:3002/ws";

export class AIOpponent {
  private ws: WebSocket;
  private playerId?: number;
  private latestSnapshot: gameState | null = null;
  private currentDirection: key | null = null;
  private lastSendDirection: key | null = null;
  private lastBall: Ball | null = null;
  private recentering: boolean = false;
  private predictedY: number = 200;

  private readonly FIELD_WIDTH = 800;
  private readonly FIELD_HEIGHT = 400;
  private readonly commitZone = 10;
  private readonly aimNoisePx = 5;

  constructor(game_id: string) {
    this.ws = new WebSocket(SERVER_URL, { 
		rejectUnauthorized: false,
		headers: {
    	Authorization: `Bearer ${IA_KEY}`,
  },
	 });
    this.ws.on('open', () => {
      console.log('WebSocket connected');
      const command: ClientJoinMessage = { type: "join", roomId: game_id };
      this.ws.send(JSON.stringify(command));
      console.log('Join command sent:', command);
    });

    this.ws.on('message', (data) => {
      try {
        const msg: ServerMessage = JSON.parse(data.toString());
        if (msg.type === "info" && msg.data.playerId) {
          this.playerId = msg.data.playerId;
        }
        if (msg.type === "state") {
          this.latestSnapshot = msg.state;
          this.lastBall = { ...msg.state.ball };
        }
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    });

    this.ws.on('close', () => console.log('WebSocket closed'));
    this.ws.on('error', (err) => console.error('WebSocket error:', err));

    // Lecture de l’état du jeu toutes les 1s
    setInterval(() => this.processAI(), 1000);
    // Mouvement fluide toutes les 50ms
    setInterval(() => this.keepMoving(), 50);
  }

  private getPlayerFromSnapshot(snapshot: gameState): Player | undefined {
    if (this.playerId === 1)
      return (snapshot.player1);
    if (this.playerId === 2)
      return (snapshot.player2);
    return (undefined);
  }

  private processAI() {
    if (!this.latestSnapshot || !this.lastBall)
      return;
    const snapshot = this.latestSnapshot;
    const aiPlayer = this.getPlayerFromSnapshot(snapshot);
    if (!aiPlayer)
      return;
    const ball = snapshot.ball;
    if (this.lastBall.dx && Math.sign(ball.dx) !== Math.sign(this.lastBall.dx))
      this.recentering = true;
    const ballTowardsAI = (this.playerId === 1 && ball.dx < 0) ||
                          (this.playerId === 2 && ball.dx > 0);
    const dangerZone = this.FIELD_WIDTH * 0.75;
    const inDanger = (this.playerId === 1 && ball.x < dangerZone) ||
                     (this.playerId === 2 && ball.x > this.FIELD_WIDTH - dangerZone);
    let targetY: number;
    if (this.recentering && !ballTowardsAI)
      targetY = this.FIELD_HEIGHT / 2;
    else if (ballTowardsAI && inDanger) {
      targetY = this.predictBallY(ball, aiPlayer.x);
      targetY += (Math.random() - 0.5) * this.aimNoisePx;
    }
    else
      targetY = this.FIELD_HEIGHT / 2;
    if (ballTowardsAI && inDanger)
      this.recentering = false;
    this.predictedY = targetY;
    this.lastBall = { ...ball };
  }

  private keepMoving() {
    if (!this.latestSnapshot || this.playerId === undefined) return;
    const aiPlayer = this.getPlayerFromSnapshot(this.latestSnapshot);
    if (!aiPlayer)
      return;
    const paddleCenter = aiPlayer.y + aiPlayer.height / 2;
    let newDirection: key | null = null;
    if (paddleCenter < this.predictedY - this.commitZone)
      newDirection = 'down';
    else if (paddleCenter > this.predictedY + this.commitZone)
      newDirection = 'up';
    this.currentDirection = newDirection;
    if (this.currentDirection !== this.lastSendDirection) {
      if (this.lastSendDirection) this.sendCommand(this.lastSendDirection, 'keyup');
      if (this.currentDirection) this.sendCommand(this.currentDirection, 'keydown');
      this.lastSendDirection = this.currentDirection;
    }
  }

  private predictBallY(ball: Ball, paddleX: number): number {
    let { x, y, dx, dy, size } = { ...ball };
    while ((dx > 0 && x < paddleX) || (dx < 0 && x > paddleX)) {
      x += dx;
      y += dy;
      if (y <= 0)
        y = -y; dy = -dy; 
      if (y >= this.FIELD_HEIGHT - size)
        y = 2 * (this.FIELD_HEIGHT - size) - y; dy = -dy;
    }
    return (y);
  }

  private sendCommand(key: key, type: 'keydown' | 'keyup') {
    if (this.ws.readyState === WebSocket.OPEN) {
      const command: ClientKeyMessage = { type, key };
      this.ws.send(JSON.stringify(command));
    }
  }

  public disconnect() {
    if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
      this.ws.close();
      console.log('WebSocket IA fermé.');
    }
  }
}
