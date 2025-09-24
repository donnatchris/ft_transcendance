import { FastifyPluginAsync } from "fastify";
import * as handlers from "../tournament/handlers.js";

const tournamentRoutes: FastifyPluginAsync = async (app) => {
  app.post("/createTournament", handlers.createTournament); //done
  app.post("/getTournament", handlers.getTournament); //done
  app.get("/getAllTournaments", handlers.getAllTournaments); //done
  app.post("/addPlayer", handlers.addPlayer); //done
  app.post("/start", handlers.start); //done
  app.post("/runRound", handlers.runNewRound); //done
  app.post("/matchHistoryByTournament", handlers.getMatchHistoryByTournament);
  app.post("/matchHistoryByPlayer", handlers.getMatchHistoryByPlayer);
  app.post("/playerTournamentStats", handlers.getPlayerTournamentStats);
  app.post("/playerNonTournamentStats", handlers.getPlayerNonTournamentStats);
  app.post("/playerWinsAndLosses", handlers.getPlayerWinsAndLosses);
  app.get("/allPlayersWinsAndLosses", handlers.getAllPlayersWinsAndLosses);
  app.get("/myWinsAndLosses", handlers.getMyWinsAndLosses);
  app.get("/myMatchHistory", handlers.getMyMatchHistory);
};

export default tournamentRoutes;
