import { FastifyReply, FastifyRequest } from "fastify";
import { MatchRepository, MatchHistory } from "../repository/MatchRepository.class.js";
import { TournamentManager } from "../repository/TournamentManager.class.js";
import { Tournament } from "../game_server/chris/Tournament.class.js";
import { TournamentOptions } from "../game_server/chris/TournamentTypes.js";
import { Participant } from "../game_server/chris/Participant.class.js";

const tournamentManager = new TournamentManager();
const matchRepo = new MatchRepository();


//Créer un tournoi
export async function createTournament(req: FastifyRequest<{ Body: { name: string; opts?: TournamentOptions }}>, reply: FastifyReply) : Promise<void> {
  const user = req.token as { id_user: number; display_name: string; avatar: string | null } | undefined;
  if (!user) {
	  return reply.status(401).send({
		success: false,
		message: "Non authenticated."
	});
  }
  if (!req.body.name || req.body.name.trim() === "") {
	return reply.status(400).send({
	  success: false,
	  message: "Tournament name is required.",
	});
  }
  const userHasAlreadyCreatedTournament = tournamentManager.listTournaments().some(t => t.created_by?.id === user.id_user && t.status !== "done");
  if (userHasAlreadyCreatedTournament) {
	return reply.status(400).send({
	  success: false,
	  message: "You have already created a tournament. You cannot create multiple tournaments at the same time.",
	});
  }
  const nameExists = tournamentManager.getTournament(req.body.name);
  const nameExistsInDb = await matchRepo.tournamentExists(req.body.name);
  if (nameExists || nameExistsInDb) {
	return reply.status(409).send({
	  success: false,
	  message: "Tournament name already exists.",
	});
  }
  const userArray = new Array<Participant>;
  const creator = Participant.createFromUser(user);
  if (!creator) {
	return reply.status(400).send({
		success: false,
		message: "Creator not valid.",
	});
  }
  userArray.push(creator);
  const tournamentOptions = req.body.opts?? {};
  tournamentOptions.repo = new MatchRepository();
  tournamentOptions.playerArray = userArray;
  tournamentOptions.created_by = creator;
  const tournament = new Tournament(req.body.name, tournamentOptions);
  tournamentManager.addTournament(tournament);
  reply.status(201).send({
    success: true,
    message: "Tournament successfully created.",
    tournament: tournament.toJSON(),
  })
};

//Recuperer un tournoi
export async function getTournament(req: FastifyRequest<{ Body: { name: string }}>, reply: FastifyReply) : Promise<void> {
  const tournament = tournamentManager.getTournament(req.body.name);
  if (!tournament)
    return reply.status(404).send({
      success: false,
      message: "Tournament not found."
  })
  reply.status(200).send({
    success: true,
    message: "Tournament found.",
    tournament: tournament.toJSON(),
  })
};

//Recuperer tableau de tournois
export async function getAllTournaments(req: FastifyRequest, reply: FastifyReply) : Promise<void> {
  tournamentManager.cleanupFinishedTournaments();
  const tournaments = tournamentManager.listTournaments();
  if (!tournaments)
    return reply.status(404).send({
      success: false,
      message: "No tournaments."
  })
  reply.status(200).send({
    success: true,
    message: "Tournaments found.",
    tournamentArray: tournaments.map(t => t.toJSON()),
  })
};

//Ajoute un joueur
export async function addPlayer(req: FastifyRequest<{ Body: { name: string } }>, reply: FastifyReply): Promise<void> {
  const user = req.token as { id_user: number; display_name: string; avatar: string | null } | undefined;
  if (!user) {
	  return reply.status(401).send({
		success: false,
		message: "Non authenticated."
	});
  }
  const participant = Participant.createFromUser(user);
  if (!participant) {
	return reply.status(400).send({
		success: false,
		message: "Participant not valid.",
	});
  }
  const tournament = tournamentManager.getTournament(req.body.name);
  if (!tournament) {
    return reply.status(404).send({
      success: false,
      message: "Tournament not found.",
    });
  }
  try {
	  tournament.addPlayer(participant);
	  reply.status(201).send({
		  success: true,
		  message: "Player successfully added to the tournament.",
		  tournament: tournament.toJSON()
		});
	} catch (err: any) {
		if (err.message === "Too many participants.") {
			return reply.status(400).send({
				success: false,
				message: "Tournament is full.",
			});
		} else if (err.message === "Participant already registered.") {
			return reply.status(409).send({
				success: false,
				message: "Participant already registered in the tournament.",
			});
		}
		return reply.status(500).send({
			success: false,
			message: "Internal server error.",
		});
	}
}

//Lancer le tournoi
export const start = async (req: FastifyRequest, reply: FastifyReply) => {
  const user = req.token as { id_user: number; display_name: string; avatar: string | null } | undefined;
  if (!user) {
	  return reply.status(401).send({
		success: false,
		message: "Non authenticated."
	});
  }
  const { name } = req.body as { name: string };
  const tournament = tournamentManager.getTournament(name);
  if (!tournament) {
	return reply.status(404).send({
	  success: false,
	  message: "Tournament not found.",
	});
  }
  if (user.id_user !== tournament.created_by?.id) {
	return reply.status(403).send({
	  success: false,
	  message: "Only the tournament creator can start it.",
	});
  }
  if (tournament.status !== "locked") {
	return reply.status(400).send({
	  success: false,
	  message: "Tournament already started.",
	});
  }
  tournament.start();
  reply.status(200).send({
	success: true,
	message: "Tournament is starting!",
	tournament: tournament.toJSON(),
  });
};

// lancer le round actuel
export const runNewRound = async (req: FastifyRequest, reply: FastifyReply) => {
  const user = req.token as { id_user: number; display_name: string; avatar: string | null } | undefined;
  if (!user) {
	  return reply.status(401).send({
		success: false,
		message: "Non authenticated."
	});
  }
  const { name } = req.body as { name: string };
  const tournament = tournamentManager.getTournament(name);
  if (!tournament) {
	return reply.status(404).send({
	  success: false,
	  message: "Tournament not found.",
	});
  }
  if (user.id_user !== tournament.created_by?.id) {
	return reply.status(403).send({
	  success: false,
	  message: "Only the tournament creator can start it.",
	});
  }
  if (tournament.status !== "running") {
	return reply.status(400).send({
	  success: false,
	  message: "Tournament not running.",
	});
  }
  try {
	tournament.runNewRound();
	reply.status(200).send({
		success: true,
		message: "Round is running!",
		tournament: tournament.toJSON(),
	});
  } catch (err: any) {
	return reply.status(500).send({
		success: false,
		message: "Internal server error.",
	});
  }
};

//Recuperer l'historique des matchs d'un tournoi
export const getMatchHistoryByTournament = async (  req: FastifyRequest<{ Body: { name: string } }>, reply: FastifyReply): Promise<void> => {
  const tournamentName = req.body.name;
  if (!tournamentName) {
    return reply.status(400).send({
      success: false,
      message: "Tournament name is required.",
    });
  }
    try {
    const history: MatchHistory[] = await matchRepo.getMatchHistoryByTournament(tournamentName);
    reply.status(200).send({
      success: true,
      message: "Match history retrieved successfully.",
      history,
    });
  } catch (err: any) {
    reply.status(500).send({
      success: false,
      message: "Internal server error.",
      history: [],
    });
  }
};

// Récupérer l'historique des matchs d'un joueur
export const getMatchHistoryByPlayer = async (req: FastifyRequest<{ Body: { playerId: number } }>, reply: FastifyReply): Promise<void> => {
  const playerId = req.body.playerId;
  if (!playerId) {
    return reply.status(400).send({
      success: false,
      message: "Player ID is required.",
    });
  }
  try {
    const history: MatchHistory[] = await matchRepo.getMatchHistoryByPlayer(playerId);
    reply.status(200).send({
      success: true,
      message: "Player match history retrieved successfully.",
      history,
    });
  } catch (err: any) {
    reply.status(500).send({
      success: false,
      message: "Internal server error.",
      history: [],
    });
  }
};

// Récupérer les stats d'un joueur pour un tournoi donné
export const getPlayerTournamentStats = async (req: FastifyRequest<{ Body: { playerId: number; tournamentName: string } }>, reply: FastifyReply): Promise<void> => {
  const { playerId, tournamentName } = req.body;
  if (!playerId || !tournamentName) {
    return reply.status(400).send({
      success: false,
      message: "Player ID and tournament name are required.",
    });
  }
  try {
    const stats = await matchRepo.getPlayerTournamentStats(playerId, tournamentName);
    reply.status(200).send({
      success: true,
      message: "Player tournament stats retrieved successfully.",
      stats,
    });
  } catch (err: any) {
    reply.status(500).send({
      success: false,
      message: "Internal server error.",
      stats: { wins: 0, losses: 0 },
    });
  }
};

// Récupérer les stats d'un joueur pour les matchs hors-tournois
export const getPlayerNonTournamentStats = async (req: FastifyRequest<{ Body: { playerId: number } }>, reply: FastifyReply): Promise<void> => {
  const { playerId } = req.body;
  if (!playerId) {
    return reply.status(400).send({
      success: false,
      message: "Player ID is required.",
    });
  }
  try {
    const stats = await matchRepo.getPlayerNonTournamentStats(playerId);
    reply.status(200).send({
      success: true,
      message: "Player non-tournament stats retrieved successfully.",
      stats,
    });
  } catch (err: any) {
    reply.status(500).send({
      success: false,
      message: "Internal server error.",
      stats: { wins: 0, losses: 0 },
    });
  }
};

// Récupérer le nombre de victoires et de défaites d'un joueur
export const getPlayerWinsAndLosses = async (req: FastifyRequest<{ Body: { id_player: number } }>, reply: FastifyReply): Promise<void> => {
  const { id_player } = req.body;
  if (!id_player) {
	return reply.status(400).send({
	  success: false,
	  message: "Player ID is required.",
	});
  }
  try {
	const stats = await matchRepo.getPlayerWinsAndLosses(id_player);
	reply.status(200).send({
		success: true,
		message: "Player wins and losses retrieved successfully.",
		stats: stats,
	});
  } catch (err: any) {
	reply.status(500).send({
		success: false,
		message: "Internal server error.",
		stats: { wins: 0, losses: 0 },
	});
  }
};

// Récupérer le nombre de victoires et de défaites du joueur connecté
export const getMyWinsAndLosses = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const user = req.token as { id_user: number; display_name: string; avatar: string | null } | undefined;
  if (!user) {
	  return reply.status(401).send({
		success: false,
		message: "Non authenticated."
	});
  }
  try {
	const stats = await matchRepo.getPlayerWinsAndLosses(user.id_user);
	reply.status(200).send({
		success: true,
		message: "My wins and losses retrieved successfully.",
		stats: stats,
	});
  } catch (err: any) {
	reply.status(500).send({
		success: false,
		message: "Internal server error.",
		stats: { wins: 0, losses: 0 },
	});
  }
};

// Récupérer le nombre de victoires et de défaites de tous les joueurs
export const getAllPlayersWinsAndLosses = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
	const allStats = await matchRepo.getAllPlayersWinsAndLosses();
	reply.status(200).send({
		success: true,
		message: "All players wins and losses retrieved successfully.",
		allStats: allStats,
	});
  } catch (err: any) {
	reply.status(500).send({
		success: false,
		message: "Internal server error.",
		allStats: [],
	});
  }
};

// Récupérer l'historique des matchs du joueur connecté
export const getMyMatchHistory = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const user = req.token as { id_user: number; display_name: string; avatar: string | null } | undefined;
  if (!user) {
	  return reply.status(401).send({
		success: false,
		message: "Non authenticated."
	});
  }
  try {
	const matchHistory: MatchHistory[] = await matchRepo.getMatchHistoryByPlayer(user.id_user);
	reply.status(200).send({
		success: true,
		message: "My match history retrieved successfully.",
		matchHistory,
	});
  } catch (err: any) {
	reply.status(500).send({
		success: false,
		message: "Internal server error.",
		matchHistory: [],
	});
  }
};
