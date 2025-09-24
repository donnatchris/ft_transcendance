// import { PongApp } from './PongApp.js'


// export class Tournament {

//     private name: string;
//     private size: number;
//     private challengersId[]: number;
//     private totalRounds;
//     private currentRound;


// }



// Côté front (orchestrateur)

// Crée une seule classe fine qui pilote PongApp et parle au backend tournoi.

// Classe : TournamentClient
// Rôle : s’inscrire, écouter les événements du tournoi, lancer/rejoindre les matchs, afficher l’état.

// Méthodes clés (sans code) :

// create(name, size, mode) → crée un tournoi (retourne tournamentId)

// join(tournamentId) → inscription du joueur

// checkIn(tournamentId) → confirme présence avant le start

// subscribe(tournamentId) → ouvre un canal WS “tournament/<id>” et écoute les events

// getState(tournamentId) → récupère l’état (participants, round, bracket)

// on(event, cb) → callbacks (match_ready, match_started, match_over, round_over, tournament_over, error)

// handleMatchReady(match) → si l’utilisateur est dedans, appelle PongApp.join(match.roomId)

// handleMatchOver(result) → met à jour l’UI et attend la suite

// leave(tournamentId) → se désinscrire/fermer WS

// attachPong(pongApp: PongApp) → branchement propre avec ta PongApp

// list(tournamentFilter?) → (optionnel) lister les tournois disponibles

// Idée : TournamentClient ne gère pas le jeu lui‑même, il déclenche seulement pong.join(roomId) et écoute les retours.

// Côté backend (service tournoi)

// Si tu veux cadrer l’API à appeler, pense en une classe noyau qui gère le métier (peu importe que tu l’implémentes en services Fastify après).

// Classe : TournamentService
// Rôle : gérer le cycle de vie d’un tournoi + matches.

// Méthodes clés (sans code) :

// createTournament(ownerId, { name, size, mode, rules? }) -> tournamentId

// joinTournament(tournamentId, userId)

// checkIn(tournamentId, userId)

// startTournament(tournamentId) → freeze inscriptions, seed, génère Round 1

// getState(tournamentId) → participants, bracket, round courant, matches

// advanceMatch(matchId, winnerId, scores?) → clôt le match et fait avancer le bracket

// forfeit(matchId, userId) → défaite par forfait

// onEvent(tournamentId, cb) → broadcast WS (match_ready, match_started, match_over, round_over, tournament_over)

// cancelTournament(tournamentId) (optionnel)

// listTournaments(filter?)

// Interne (non exposées, mais utiles en design) :

// seedParticipants(tournamentId)

// generateRound(tournamentId, roundNumber)

// createMatch(tournamentId, p1, p2) -> matchId + roomId (appelle ton service game)

// allMatchesDone(tournamentId, roundNumber) -> boolean

// computeNextPairings(tournamentId, roundNumber)

// Côté service game (déjà en place)

// Tu as déjà RemoteGame/PongApp. Ajoute juste deux endpoints métiers que le TournamentService appellera :

// createRoom({ mode, player1Id, player2Id }) -> { roomId, accessToken }

// reportResult({ roomId, winnerId, scores }) -> ok (ou un callback WS côté tournoi)

// En résumé (ce qu’il faut créer)

// Front : 1 classe TournamentClient avec 10–12 méthodes simples (join, checkIn, subscribe, on, handleMatchReady → pong.join(roomId)…).

// Back (métier) : 1 classe TournamentService avec ~8 méthodes publiques (create/join/checkIn/start/getState/advanceMatch/forfeit/onEvent).

// Game : 2 points d’accroche (createRoom, reportResult).

// Tu peux démarrer en “faux backend” (mock) : TournamentClient.startFake() génère un bracket local et appelle pong.join() pour valider le flux UI avant d’implémenter le vrai service.