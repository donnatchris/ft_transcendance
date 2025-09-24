process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import websocket from "@fastify/websocket";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fs from "fs";
import routes from "./routes/index.routes.js";
import fastifyCookie from "@fastify/cookie";
import my_jwt, { SECRET_KEY } from "./jwt.js";

const options = {
	key: fs.readFileSync("/etc/ssl/selfsigned.key"),
	cert: fs.readFileSync("/etc/ssl/selfsigned.crt"),
};

const app = Fastify({
	logger: true,
	https: options,
});

await app.register(fastifyCookie);

await app.register(fastifyJwt, {
	secret: SECRET_KEY,
	cookie: {
		cookieName: "token",
		signed: false,
	},
});
await app.register(my_jwt);
await app.register(websocket);
await app.register(cors, { origin: true, credentials: true });

await app.register(routes, { prefix: "/" });

// Démarre le serveur
app.listen({ port: 3002, host: "0.0.0.0" })
	.then(() => {
		console.log("Server listening on port 3002");
	})
	.catch((err) => {
		app.log.error(err);
		process.exit(1);
	});

// // chris test tournament
// import { Participant } from "./game_server/chris/Participant.class.js";
// import { Tournament } from "./game_server/chris/Tournament.class.js";
// import type { IMatchRepository } from "./game_server/chris/IMatchRepository.js";

// // ---------- 1) Mock léger du repo (log console) ----------
// const repoMock: IMatchRepository = {
//   async saveMatch(matchDto: any) {
//     console.log(`[repo] saveMatch: winner=${matchDto.winner?.display_name ?? "null"} status=${matchDto.status}`);
//   },
//   async saveTournamentCreation(t) {
//     console.log(`[repo] saveTournamentCreation: name=${t.name}`);
//   },
//   async saveTournamentEnd(t) {
//     console.log(`[repo] saveTournamentEnd: winner=${t.winner?.display_name ?? "null"}`);
//   }
// } as IMatchRepository;

// // ---------- 2) Monkeypatch du roomManager pour retourner une FakeRoom ----------
// /**
//  * Ta classe Match fait: roomManager.createRoom({ id, mode })
//  * On remplace createRoom/deleteRoom par des stubs très simples.
//  * La FakeRoom émet quelques "score" puis "victory" pour terminer le match automatiquement.
//  */
// import { manager as roomManager } from "./game_server/server.js";
// import { EventEmitter } from "events";

// class FakeGame extends EventEmitter {
//   public mode: "tournament" | "remote" | "local" = "tournament";
//   start() {/* noop */}
//   stop() {/* noop */}
//   getState() { return {}; }
// }

// class FakeRoom extends EventEmitter {
//   public id: string;
//   public game: FakeGame = new FakeGame();
//   private registered: number[] = [];

//   constructor(opts: { id: string; mode: string }) {
//     super();
//     this.id = opts.id;

//     // Simule un match: 2-4 updates de score puis victoire
//     const bursts = Math.floor(Math.random() * 3) + 2; // 2..4
//     let s1 = 0, s2 = 0;

//     const tick = (n: number) => {
//       if (n === 0) {
//         // Emission de la victoire (le gagnant sera recalculé par Match via ses scores)
//         this.game.emit("victory", { winner: {} as any });
//         // Vide la room ensuite pour propre (non nécessaire)
//         setTimeout(() => this.emit("empty"), 5);
//         return;
//       }
//       // incréments aléatoires mais modestes
//       s1 += Math.random() < 0.5 ? 1 : 0;
//       s2 += Math.random() < 0.5 ? 1 : 0;
//       this.game.emit("score", { score1: s1, score2: s2 });
//       setTimeout(() => tick(n - 1), 50);
//     };
//     // Démarre le "jeu"
//     setTimeout(() => tick(bursts), 50);
//   }

//   register(uid: number, requestedLocalId?: 1 | 2) {
//     if (!this.registered.includes(uid)) this.registered.push(uid);
//     // renvoie 1 ou 2 pour rester proche de GameRoom.register
//     return requestedLocalId ?? (this.registered.length as 1 | 2);
//   }
// }

// // monkeypatch
// (roomManager as any).createRoom = (opts: { id: string; mode: string }) => {
//   const r = new FakeRoom(opts);
//   console.log(`[fake-room] createRoom id=${opts.id} mode=${opts.mode}`);
//   return r;
// };
// (roomManager as any).deleteRoom = (id: string) => {
//   console.log(`[fake-room] deleteRoom id=${id}`);
// };

// // ---------- 3) Fabrique 8 joueurs humains (ou mélange avec des AI si tu veux) ----------
// const players = Array.from({ length: 8 }, (_, i) =>
//   Participant.createFromUser({ id_user: i + 1, display_name: `P${i + 1}` })
// );

// // ---------- 4) Instancie le tournoi ----------
// const t = new Tournament("E2E Cup", {
//   numberOfRounds: 3,         // 8 -> 4 -> 2 -> 1
//   playersPerMatch: 2,
//   playerArray: players,      // Si < 8, le tournoi complètera avec des AI
//   repo: repoMock,
// });

// // ---------- 5) Démarre le tournoi ----------
// t.start();
// console.log("Tournament started:", { status: t.status, rounds: t.numberOfRounds });

// // ---------- 6) Boucle d’orchestration: lance chaque round, attends un court délai, stop le round,
// // puis passe au suivant jusqu’au vainqueur final ----------
// async function runAllRounds() {
//   while (!t.isFinished()) {
//     const round = t.roundArray[t.currentRound];

//     console.log(`\n--- Round #${t.currentRound} (matches=${round.numberOfMatches}) ---`);
//     t.runNewRound();
//     console.log(`Round ${t.currentRound} started. Status:`, round.status);

//     // ✅ Attends que tous les Match du round soient 'done'
//     await waitFor(() => round.matchArray.every(m => m.status === 'done'), 5000, 50);

//     // Puis stoppe proprement le round (remplit winnerArray, passe au suivant)
//     t.stopCurrentRound();
//     console.log(`Round ${t.currentRound + 1} done. Tournament status:`, t.status);
//   }

//   console.log("\n=== Tournament Finished ===");
//   console.log("Winner:", t.winner?.display_name ?? "null");
// }

// async function waitFor(predicate: () => boolean, timeoutMs = 5000, intervalMs = 50) {
//   const start = Date.now();
//   while (!predicate()) {
//     if (Date.now() - start > timeoutMs) throw new Error("Timeout while waiting condition.");
//     await new Promise(res => setTimeout(res, intervalMs));
//   }
// }

// runAllRounds().catch(err => {
//   console.error("E2E error:", err);
//   process.exit(1);
// });

// // util
// function sleep(ms: number) {
//   return new Promise(res => setTimeout(res, ms));
// }
