import { Tournament } from "../game_server/chris/Tournament.class";

export class TournamentManager {
	private tournamentsMap: Map<string, Tournament> = new Map();

	addTournament(tournament: Tournament) {
		this.tournamentsMap.set(tournament.name, tournament);
	}

	getTournament(name: string): Tournament | undefined {
    return this.tournamentsMap.get(name);
	}

  	listTournaments(): Tournament[] {
    	return Array.from(this.tournamentsMap.values());
  	}

	removeTournament(name: string): boolean {
    	return this.tournamentsMap.delete(name);
  	}

  	clearTournaments(): void {
    	this.tournamentsMap.clear();
  	}

	cleanupFinishedTournaments(): void {
		for (const [name, tournament] of this.tournamentsMap) {
			if (tournament.status === 'done') {
				this.tournamentsMap.delete(name);
			}
		}
	}
	
}
