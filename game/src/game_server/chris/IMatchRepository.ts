import Match from "./Match.class.js";
import { Tournament } from "./Tournament.class.js";


export interface IMatchRepository {
	saveTournamentCreation(tournament: Tournament): Promise<void>;
	saveTournamentEnd(tournament: Tournament): Promise<void>;
	saveMatch(match: Match): Promise<void>;
}
