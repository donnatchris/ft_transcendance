import { getProfile, getMyMatchHistory, MatchHistory } from '../../../utils/getters.js'
import { drawCamembert } from './camembert.js';

const match1Test: MatchHistory = {
	id: 2,
	tournament_id: "TournoisTest1",
	player1_id: 14,
	player1_display_name: "Archibald",
  	score1: 12,
  	player2_id: 3,
 	player2_display_name: "Camilla",
  	score2: 2,
  	winner_id: 14,
  	status: "done",
  	started_at: "12h45",
  	ended_at: "12h50",
  	winner_name: "Archibald",
  	tournament_name: "tournois test 1"
}

const match2Test: MatchHistory = {
	id: 4,
	tournament_id: "TournoisTest2",
	player1_id: 14,
	player1_display_name: "Archibald",
  	score1: 1,
  	player2_id: 5,
 	player2_display_name: "Igor",
  	score2: 6,
  	winner_id: 5,
  	status: "done",
  	started_at: "12h52",
  	ended_at: "12h55",
  	winner_name: "Igor",
  	tournament_name: "tournois test 2"
}

function fillLineTournament(match: MatchHistory, userId: number): HTMLElement {
	// Création de la ligne principale avec bordure, coins arrondis et fond
	const line = document.createElement('div');
	if (!match.winner_id) {
		line.className = "flex items-center gap-4 p-3 mb-3 border border-gray-500 bg-gray-900 rounded-lg shadow-sm hover:bg-gray-800 transition-colors";
	} else if (userId === match.winner_id) {
		line.className = "flex items-center gap-4 p-3 mb-3 border border-green-500 bg-gray-900 rounded-lg shadow-sm hover:bg-gray-800 transition-colors";
	} else {
		line.className = "flex items-center gap-4 p-3 mb-3 border border-red-500 bg-gray-900 rounded-lg shadow-sm hover:bg-gray-800 transition-colors";
	}

	// Infos tournoi
	// if (match.tournament_name) {
	// 	const tournamentSpan = document.createElement('span');
	// 	tournamentSpan.className = "font-tomorrow font-bold text-gray-500 max-w-[180px] inline-block overflow-hidden text-ellipsis whitespace-nowrap";
	// 	tournamentSpan.textContent = match.tournament_name;
	// 	line.appendChild(tournamentSpan);
	// }

	// Joueur 1
	const p1 = document.createElement('span');
	if (match.player1_id == userId){
		p1.className = "font-tomorrow font-bold";
	} else {
		p1.className = "font-tomorrow font-bold text-gray-500";
	}
	if (match.player1_id == match.winner_id){
		p1.textContent = ` 🏆${match.player1_display_name}`;
	} else {
		p1.textContent = match.player1_display_name;
	}
	line.appendChild(p1);

	// Score 1
	const score1 = document.createElement('span');
	if (match.player1_id == userId){
		score1.className = "font-tomorrow font-bold";
	} else {
		score1.className = "font-tomorrow font-bold text-gray-500";
	}
	score1.textContent = ` ${match.score1}`;
	line.appendChild(score1);

	// Tiret
	const dash = document.createElement('span');
	dash.className = "font-bold";
	dash.textContent = ' - ';
	line.appendChild(dash);

	// Score 2
  	const score2 = document.createElement('span');
  	if (match.player2_id == userId){
		score2.className = "font-tomorrow font-bold";
	} else {
		score2.className = "font-tomorrow font-bold text-gray-500";
	}
  	score2.textContent = `${match.score2} `;
  	line.appendChild(score2);

	// Joueur 2
	const p2 = document.createElement('span');
	if (match.player2_id == userId){
		p2.className = "font-tomorrow font-bold";
	} else {
		p2.className = "font-tomorrow font-bold text-gray-500";
	}
	if (match.player2_id == match.winner_id){
		p2.textContent = `${match.player2_display_name}🏆 `;
	} else {
		p2.textContent = match.player2_display_name;
	}
	line.appendChild(p2);

	// Date
	if (match.started_at) {
		const date = document.createElement('span');
		date.className = "text-xs text-gray-500 ml-2";
		date.textContent = match.started_at;
		line.appendChild(date);
	}

	return line;
}

async function fillStats(profile: any, statsDiv: HTMLDivElement) {
	if (!statsDiv) {
		return;
	}
	statsDiv.textContent = '';

	//	a commenter pour tester
	const matchHistory = await getMyMatchHistory();
	if (!matchHistory || matchHistory.length === 0) {
		statsDiv.textContent = 'You did not participate in any tournament or online play so far';
		return;
	}
	//

	let line: HTMLElement;

	//	a commenter pour tester
	for (let i = 0; i < matchHistory.length; i++) {
		line = fillLineTournament(matchHistory[i], profile.id_user);
		statsDiv.appendChild(line);
	}
	//

	// a decommenter pour tester
	// line = fillLineTournament(match1Test, 14);
	// statsDiv.appendChild(line);
	// line = fillLineTournament(match2Test, 14);
	// statsDiv.appendChild(line);
	//
}

export async function addStatsEvents() {
	const currentDiv = document.getElementById("stats_view");
	const statsOk = currentDiv?.querySelector('#stats-ok');
	const statsKo = currentDiv?.querySelector('#stats-ko');
	const profile = await getProfile();
	if (!profile) {
		statsOk!.classList.add('hidden');
		statsKo!.classList.remove('hidden');
		console
	} else {
		statsKo!.classList.add('hidden');
		statsOk!.classList.remove('hidden');
		const canvas = currentDiv?.querySelector("#canvasCamembert")! as HTMLCanvasElement;
		const statsDiv = currentDiv?.querySelector("#historyData") as HTMLDivElement;
		const ctx = canvas!.getContext('2d');
		if (!ctx) {
  			console.error("Error while drawing tournament canvas");
  			throw new Error("Canvas context missing");
		}
		await drawCamembert(profile, ctx, canvas);
		await fillStats(profile, statsDiv);
	}
}