import { getUser } from "../../../utils/getters.js";
import { tournamentIntervalId } from "./tournament.js";

function isLooser(tournament: any, user: any): boolean{
	if (tournament.currentRound >= 2 || tournament.currentRound < 0)
		return false;
	const lastRound = tournament.roundArray[tournament.currentRound + 1];
	if (lastRound.matchArray && lastRound.matchArray.length > 0){
		for (let i = 0; i < lastRound.matchArray.length; i++){
			if (lastRound.matchArray[i].winner.id === user.id_user){
				return (false);
			}
		}
	}
	return (true);
} 

export async function fillDataTournament(tournament: any){
	const	tournamentSection = document.getElementById("tournamentSection");
	const	nameDiv = document.getElementById("tournamentName");
	const	phaseDiv = document.getElementById("phaseName");
	const	dataDiv = document.getElementById("tournamentData");
	if (nameDiv){
		nameDiv.textContent = tournament.name.toUpperCase();
	}
	if (phaseDiv){
		phaseDiv.innerHTML = "";
	}
	if (phaseDiv){
		phaseDiv.textContent = "Current round: " + tournament.phase;
		let content = document.createElement('p');
		content.classList = "";
		const user = await getUser();
		if (!user){
			return;
		}
		if (tournament.winner) {
			clearInterval(tournamentIntervalId);
			
			if (user.id_user == tournament.winner.id) {
    			content.className = "px-4 py-3 mb-2 border border-green-400 bg-green-100/10 text-green-300 rounded-lg shadow font-bold text-lg text-center";
    			content.innerHTML = `
				<pre class="block text-yellow-400 bg-transparent border-none text-left text-[1.1em] animate-pulse">
   '._==_==_==_.' 
   .-\:______ /-.
   | (|:.    |) |
    '-|:.    |-'
      \\::.  /
       '::.'
        )_(
      _.'-'._
     """""""""
				</pre>
        			<div style="margin-top: 8px;">
            🏆 			${tournament.winner.display_name} won the tournament! You can now quit this section
        			</div>
    			`;
			} else {
				content.className = "flex items-center gap-2 px-4 py-3 mb-2 border border-white bg-green-100/10 text-green-300 rounded-lg shadow font-bold text-lg";
			}
		} else if (isLooser(tournament, user)) {
			content.className = "flex items-center gap-2 px-4 py-3 mb-2 border border-red-400 bg-red-100/10 text-red-300 rounded-lg shadow font-bold text-lg";
			content.textContent = "💀 The game is over for you! You can now quit this section";
		} else {
			content.className = "flex items-center gap-2 px-4 py-3 mb-2 border border-yellow-400 bg-yellow-100/10 text-yellow-300 rounded-lg shadow font-bold text-lg animate-pulse";
			content.textContent = "⏳ Match will begin soon";
		}
		phaseDiv.appendChild(content);
	}
}
