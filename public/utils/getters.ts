import { LoginDataObject } from "../const/types.js";
import { displayMessage } from "./show.js";

export async function sendRequest(method: "GET" | "POST" | "DELETE" | "PATCH", url: string, name?: any): Promise<Response>{
	let headers: Record<string, string>;
	let response : Response;
	if (name && method == "POST"){
		headers = {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}
		response = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: headers,
			body: JSON.stringify({ name })
		});
	} else {
		headers = {
			'Accept': 'application/json',
		}
		response = await fetch(url, {
			method: method,
			headers: headers
		});
	}
	return (response);
}

export async function postLogin(data: LoginDataObject, div: HTMLDivElement): Promise<any | null>{
	try {
		const response = await fetch("/gate/user/login", {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});
		const result = await response.json();
		if (!response.ok){
			displayMessage("Invalid credentials", div, "failure");
			return (null);
		} else if (!result.success) {
			displayMessage(result.messsage, div, "failure");
			return (null);
		} else {
			displayMessage("Login successful! Redirecting...", div, "success");
			return (result.message);
		}
	} catch (error) {
		console.error("[PUBLIC: postLogin] Error while login: ", error);
		displayMessage("Login error: " + error, div, "failure");
      	return (null);
	}
}

export async function getUser(): Promise<any | null> {
	try {
		const response = await sendRequest('GET', '/gate/user/me');
	  	const result = await response.json();
	  	if (!response.ok || !result.success) {
			console.debug("[PUBLIC: getUser] No user found");
			return (null);
	  	}
      	return (result.user);
	}
	catch (error) {
		console.error("[PUBLIC: getUser] Error fetching user: ", error);
      	return (null);
	}
  }

export async function getProfile(): Promise<any | null> {
	try {
		const response = await sendRequest('GET', '/gate/user/profile');
	  	const result = await response.json();
	  	if (!response.ok || !result.success) {
			console.debug("[PUBLIC: getProfile] No profile found");
			return (null);
	  	}
      	return (result.profile);
	} catch (error) {
		console.error("[PUBLIC: getProfile] Error fetching profile: ", error);
      	return (null);
	}
}

export async function getFriends(): Promise<any | null> {
	try {
		const response = await sendRequest('GET', '/gate/user/friends');
	  	const result = await response.json();
	  	if (!response.ok || !result.success) {
			console.debug("[PUBLIC: getFriends] No friends found");
			return (null);
	  	}
	  	return (result.friends);
	} catch (error) {
		console.error("[PUBLIC: getFriends] Error fetching friends: ", error);
		return (null);
	}
}

export async function getAllUsers(): Promise<any | null> {
	try {
		const response = await sendRequest('GET', '/gate/user/all_users');
	  	const result = await response.json();
	  	if (!response.ok || !result.success) {
			console.debug("[PUBLIC: getAllUsers] No users found");
			return (null);
	  	}
	  	return (result.users);
	} catch (error) {
		console.error("[PUBLIC: getAllUsers] Error fetching users: ", error);
		return (null);
	}
}

export async function getLogout(){
	try {
		const response = await sendRequest('GET', '/gate/user/logout');
	  	const result = await response.json();
	  	if (!response.ok || !result.success) {
			console.debug("[PUBLIC: getLogout] Cannot logout");
			return;
	  	}
	} catch (error) {
		console.error("[PUBLIC: getLogout] Error while loging out: ", error);
		return;
	}
}

export async function getInvitations(): Promise<any | null> {
	try {
		const response = await sendRequest('GET', '/gate/user/friends_pending_invitations');
	  	const result = await response.json();
	  	if (!response.ok || !result.success) {
			console.debug("[PUBLIC: getInvitations] No invitations found");
			return (null);
	  	}
	  	return (result.invitations);
	} catch (error) {
		console.error("[PUBLIC: getInvitations] Error fetching invitations: ", error);
		return (null);
	}
}

export async function getRequests(): Promise<any | null> {
	try {
		const response = await sendRequest('GET', '/gate/user/friends_pending_requests');
	  	const result = await response.json();
	  	if (!response.ok || !result.success) {
			console.debug("[PUBLIC: getRequests] No friend requests found");
			return (null);
	  	}
	  	return (result.requests);
	} catch (error) {
		console.error("[PUBLIC: getRequests] Error fetching friend requests: ", error);
		return (null);
	}
}

export async function getPrivacyPolicy(): Promise<string | null> {
	try {
		const response = await sendRequest('GET', '/gate/user/privacy_policy');
	  	const result = await response.json();
	  	if (!response.ok || !result.success) {
			console.debug("[PUBLIC: privacyPolicy] No privacy policy found");
			return (null);
	  	}
	  	return (result.message);
	} catch (error) {
		console.error("[PUBLIC: privacyPolicy] Error fetching privacy policy: ", error);
		return (null);
	}
}

export async function getTournamentsList(): Promise<any[] | null> {
	try {
		console.debug('[Public: getTournaments] getTournaments called');
		const response = await sendRequest('GET', '/gate/game/tournament/getAllTournaments');
	  	const result = await response.json();
	  	if (!response.ok || !result.success) {
			console.debug("[Public: getTournaments] No tournaments list found");
			return (null);
	  	}
		console.debug("[Public: getTournaments] Tournaments: ", result.tournamentArray);
	  	return (result.tournamentArray);
	} catch (error) {
		console.error("[Public: getTournaments] Error fetching tournaments: ", error);
		return (null);
	}
}

export async function getTournament(name: string): Promise<any | null> {
	try {
		console.debug('[Public: getTournament] getTournaments called');
		const response = await sendRequest('POST', '/gate/game/tournament/getTournament', name);
	  	const result = await response.json();
	  	if (!response.ok || !result.success) {
			console.debug("[Public: getTournament] No tournament: " + name + " found");
			return (null);
	  	}
		console.debug("[Public: getTournament] Tournament: ", result.tournament);
	  	return (result.tournament);
	} catch (error) {
		console.error("[Public: getTournament] Error fetching tournament: ", error);
		return (null);
	}
}

export async function addPlayer(name: string): Promise<any | null> {
	try {
		console.debug('[Public: addPlayer] addPlayer called');
		const response = await sendRequest('POST', '/gate/game/tournament/addPlayer', name);
	  	const result = await response.json();
	  	if (!response.ok || !result.success) {
			console.debug("[Public: addPlayer] Error while adding player");
			return (null);
	  	}
		console.debug("[Public: addPlayer] current User added successfully: ");
	  	return (result.tournament);
	} catch (error) {
		console.error("[Public: addPlayer] Error while adding player: ", error);
		return (null);
	}
}

export async function lockAndStartTournament(name: string): Promise<any | null> {
	try {
		console.debug('[Public: startTournament] startTournament called');
		const response = await sendRequest('POST', '/gate/game/tournament/start', name);
	  	const result = await response.json();
	  	if (!response.ok || !result.success) {
			console.debug("[Public: startTournament] Error while starting tournament");
			return (null);
	  	}
		console.debug("[Public: startTournament] Tournament: ", result.tournament.name, " successfully locked");
	  	return (result.tournament);
	} catch (error) {
		console.error("[Public: startTournament] Error while starting tournament", error);
		return (null);
	}
}

export async function runNewRound(name: string): Promise<any | null> {
	try {
		console.debug('[Public: runNewRound] startTournament called');
		const response = await sendRequest('POST', '/gate/game/tournament/runRound', name);
	  	const result = await response.json();
	  	if (!response.ok || !result.success) {
			console.debug("[Public: runNewRound] Error while starting round");
			return (null);
	  	}
		console.debug("[Public: runNewRound] Round: ", result.tournament.RoundPhase, " successfully started");
	  	return (result.tournament);
	} catch (error) {
		console.error("[Public: runNewRound] Error while starting round", error);
		return (null);
	}
}

export async function deleteMe(plainPassword: string): Promise<string | null> {
	try {
	  const headers = {
		"Content-Type": "application/json"
	  };
	  const response = await fetch("/gate/user/delete_me", {
		method: "DELETE",
		headers: headers,
		body: JSON.stringify({ plainPassword }),
	  });
	  const result = await response.json();
	  return (result.message);
	} catch (err) {
	  return 'Error: ' + err;
	}
  }

  export async function getMyWinsAndLosses(): Promise<{ wins: number, losses: number} | null> {
	try {
		const response = await sendRequest('GET', '/gate/game/tournament/myWinsAndLosses');
	  	const result = await response.json();
	  	if (!response.ok || !result.success) {
			console.debug("[PUBLIC: getMyWinsAndLosses] No wins and losses found");
			return (null);
	  	}
	  	return (result.stats);
	} catch (error) {
		console.error("[PUBLIC: getMyWinsAndLosses] Error fetching wins and losses: ", error);
		return (null);
	}
  }

  export interface MatchHistory {
  id: number;
  tournament_id: string | null;
  player1_id: number | null;
  player1_display_name: string;
  score1: number;
  player2_id: number | null;
  player2_display_name: string;
  score2: number;
  winner_id: number | null;
  status: string;
  started_at: string | null;
  ended_at: string | null;
  winner_name?: string;
  tournament_name?: string | null;
}

export async function getMyMatchHistory(): Promise<MatchHistory[] | null> {
	try {
		const response = await sendRequest('GET', '/gate/game/tournament/myMatchHistory');
	  	const result = await response.json();
	  	if (!response.ok || !result.success) {
			console.debug("[PUBLIC: getMyMatchHistory] No match history found");
			return (null);
	  	}
	  	return (result.matchHistory);
	} catch (error) {
		console.error("[PUBLIC: getMyMatchHistory] Error fetching match history: ", error);
		return (null);
	}
  }
