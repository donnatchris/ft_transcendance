import { PongApp } from "./PongApp.js";
import type { Tournament } from "@transcendance/types";
import { pong } from "../Pong.Instance.js";

interface TournamentMatch {
    matchId: number;
    gameId: string | null;
    player1Id: number;
    player2Id: number;
    level: number; // 0: attente, 1: 8 joueurs, 2: 4 joueurs, 3: 2 joueurs (finale)
    status: 'waiting' | 'ready' | 'playing' | 'finished';
    winnerId?: number;
    pongApp?: PongApp;
}
interface TournamentLevel {
    level: number;
    description: string;
    totalMatches: number;
    playersCount: number;
}


type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
interface ApiFetchOptions {
	method?: HttpMethod;
	body?: any;
}

const apiBase = "/gate/game";

async function apiFetch<T>(path: string = "/", options?: ApiFetchOptions): Promise<T | undefined> {
    const { method = "GET", body } = options ?? {};
    const headers: Record<string, string> = {};
    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }
    const url = new URL(path.replace(/^\/+/, ""), `${apiBase}/tournament/`).toString();
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
export class TournamentRunner {
    private matches = new Map<number, TournamentMatch>(); // matchId -> TournamentMatch
    private playerToMatch = new Map<number, TournamentMatch>(); // playerId -> TournamentMatch
    private currentLevel: number = 0;
    private readonly levels: TournamentLevel[] = [
        { level: 0, description: "Waiting", totalMatches: 0, playersCount: 0 },
        { level: 1, description: "Quarter final", totalMatches: 4, playersCount: 8 },
        { level: 2, description: "Semi final", totalMatches: 2, playersCount: 4 },
        { level: 3, description: "Final", totalMatches: 1, playersCount: 2 }
    ];

    constructor(
        private tournamentId: number, 
    ) {}


    // Méthode statique pour créer un nouveau tournoi
    static async createTournament(name: string, createdBy: number): Promise<{ tournamentId: number; message: string } | undefined> {
        return await apiFetch<{ tournamentId: number; message: string }>("/create", {
            method: "POST",
            body: {
                name,
                createdBy
            }
        });
    }

    static async listTournaments(): Promise<Tournament[] | undefined>
    {
        return await apiFetch<Tournament[]>("/list");
    }

    // Méthode pour s'inscrire au tournoi
    async registerPlayer(userId: number): Promise<string> {
        const response = await apiFetch<{ message: string }>("/register", {
            method: "POST",
            body: {
                tournamentId: this.tournamentId,
                userId
            }
        });
        if (response)
            return response.message;
        else
        {
            console.debug("ERROR when register user to tournament " + this.tournamentId);
            return "ERROR";
        }
    }

    // Méthode pour lister les joueurs du tournoi
    async getPlayers(): Promise<{ id: number }[] | undefined> {
        return await apiFetch<{ id: number }[]> ("/list");
    }

    async run() {
        console.debug(apiFetch<string>(`/${this.tournamentId}/start`, { method: "POST"}));
        let roundOngoing = true;
        while (roundOngoing) {
            const resMatches = await apiFetch<string[]>(`/${this.tournamentId}/matches`);
            if (resMatches)
            {
                this.currentLevel = this.determineLevelFromMatches(resMatches.length);
                await this.setupMatches(resMatches);
                await this.waitForAllMatches();
                const resNext = await apiFetch<Response>(`/${this.tournamentId}/next`);
                if (resNext)
                {
                    const next = await resNext.json();
                    roundOngoing = next.message !== "Tournament ended";
                    if (!roundOngoing) {
                        console.debug("Tournoi end");
                    }
                }

            }
        }
    }

    private async setupMatches(matchesData: any[]): Promise<void> {
        const setupPromises = matchesData.map(matchData => this.setupSingleMatch(matchData));
        await Promise.all(setupPromises);
    }

    private async setupSingleMatch(matchData: any): Promise<void> {
        const hasBot = matchData.player1_id === -1 || matchData.player2_id === -1;
        const gameResult = await pong.newGame("tournament", hasBot, `tournament_${this.tournamentId}_match_${matchData.id}`);
        
        if (!gameResult) {
            console.debug(`Échec de création de partie pour match ${matchData.id}`);
            return;
        }

        const match: TournamentMatch = {
            matchId: matchData.id,
            gameId: gameResult.id,
            player1Id: matchData.player1_id,
            player2Id: matchData.player2_id,
            level: this.currentLevel,
            status: 'waiting',
            pongApp: pong
        };

        this.matches.set(matchData.id, match);

        if (matchData.player1_id !== -1 || matchData.player2_id !== -1)
        {
            if (matchData.player1_id !== -1) {
                this.playerToMatch.set(matchData.player1_id, match);
            }
            if (matchData.player2_id !== -1) {
                this.playerToMatch.set(matchData.player2_id, match);
            }
            if (hasBot) {
                // pongApp.join(gameResult.id);
                match.status = 'playing';
            }
            this.setupMatchEvents(match, matchData);
        }
        if (matchData.player2_id !== -1) {
            this.playerToMatch.set(matchData.player2_id, match);
        }

        if (hasBot) {
            pong.join(gameResult.id);
            match.status = 'playing';
        }

        this.setupMatchEvents(match, matchData);
    }

    private setupMatchEvents(match: TournamentMatch, matchData: any): void {
        if (!match.pongApp) return;

        match.pongApp.on("victory", async (data: any) => {
            const winnerId = data.winner === 1 ? match.player1Id : match.player2Id;

            await apiFetch(`/match/result`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        matchId: match.matchId,
                        score1: data.score1 || 0,
                        score2: data.score2 || 0,
                        winnerId,
                }),
                }
            );

            match.status = 'finished';
            match.winnerId = winnerId;
        });

        // match.pongApp.on("timeout", () => {
        //     console.warn(`Timeout pour match ${match.matchId}`);
        //     match.status = 'finished';
        // });
    }


    public getGameForPlayer(playerId: number): { gameId: string; matchId: number; level: number } | null {
        const match = this.playerToMatch.get(playerId);
        if (match && match.gameId && match.status !== 'finished') {
            return {
                gameId: match.gameId,
                matchId: match.matchId,
                level: match.level
            };
        }
        return null;
    }

    public joinPlayerMatch(playerId: number): boolean {
        const match = this.playerToMatch.get(playerId);
        if (match && match.pongApp && match.status === 'waiting') {
            // match.pongApp.join(match.gameId!);
            
            if (match.player1Id !== -1 && match.player2Id !== -1) {
                match.status = 'ready'; // Prêt quand au moins un joueur a rejoint
            } else {
                match.status = 'playing'; // Contre bot
            }
            
            console.debug(`👤 Joueur ${playerId} a rejoint le match ${match.matchId}`);
            return true;
        }
        return false;
    }

    public getPongAppForPlayer(playerId: number): PongApp | null {
        const match = this.playerToMatch.get(playerId);
        return match?.pongApp || null;
    }

    public getAllMatches(): TournamentMatch[] {
        return Array.from(this.matches.values());
    }

    public getMatchesByLevel(level: number): TournamentMatch[] {
        return Array.from(this.matches.values()).filter(match => match.level === level);
    }

    public getActiveMatches(): TournamentMatch[] {
        return Array.from(this.matches.values()).filter(match => 
            match.status === 'waiting' || match.status === 'ready' || match.status === 'playing'
        );
    }

    public getCurrentLevel(): number {
        return this.currentLevel;
    }

    public getLevelDescription(level: number): string {
        const levelInfo = this.levels.find(l => l.level === level);
        return levelInfo ? levelInfo.description : `Niveau ${level}`;
    }

    public getTournamentInfo() {
        return {
            tournamentId: this.tournamentId,
            currentLevel: this.currentLevel,
            levelDescription: this.getLevelDescription(this.currentLevel),
            totalMatches: this.matches.size,
            activeMatches: this.getActiveMatches().length,
            finishedMatches: Array.from(this.matches.values()).filter(m => m.status === 'finished').length,
            levels: this.levels
        };
    }

    private determineLevelFromMatches(matchCount: number): number {
        switch (matchCount) {
            case 4: return 1; // 8 joueurs -> 4 matchs
            case 2: return 2; // 4 joueurs -> 2 matchs  
            case 1: return 3; // 2 joueurs -> 1 match (finale)
            default: return 0; // En attente
        }
    }

    private async waitForAllMatches(): Promise<void> {
        return new Promise((resolve) => {
            const checkMatches = () => {
                const activeMatches = this.getActiveMatches();
                console.debug(this.getActiveMatches());
                if (activeMatches.length === 0) {
                    console.debug(`Tous les matchs du niveau ${this.currentLevel} terminés`);
                    resolve();
                } else {
                    console.debug(`⏳ ${activeMatches.length} matchs en cours...`);
                    setTimeout(checkMatches, 2000);
                }
            };
            checkMatches();
        });
    }
}
