import { PongApp } from "./game/PongApp.js";
import { getUser } from "./utils/getters.js";
import { switchFromDiv1ToDiv2 } from "./utils/show.js";
import { launchGame } from "./utils/game.js";
import { playersIntervalId, tournamentIntervalId, tournamentsIntervalId } from "./views/play/tournament/tournament.js";

async function init_game(pong: PongApp) {
	const user = await getUser();

	let currentUserDiv: HTMLSpanElement;
	let otherUserDiv: HTMLSpanElement;
	setTimeout(() => {
		if (pong.side == 'left'){
			currentUserDiv = document.getElementById('leftUser') as HTMLSpanElement;
			otherUserDiv = document.getElementById('rightUser') as HTMLSpanElement;
			if (otherUserDiv){
				otherUserDiv.textContent = "Player 2";
			}
		} else {
			currentUserDiv = document.getElementById('rightUser') as HTMLSpanElement;
			otherUserDiv = document.getElementById('leftUser') as HTMLSpanElement;
			if (otherUserDiv){
				otherUserDiv.textContent = "Player 1";
			}
		}
		if (currentUserDiv) {
			currentUserDiv.textContent = user.display_name;
		}
	}, 1000);
	const canvasFrame = document.getElementById("tournamentCanvasFrame");
	canvasFrame?.appendChild(pong.canvas);
}

export const pong = new PongApp();
pong.on("error", (e) => {
	console.error(e.msg);
});

pong.on("join_request", (e) => {
	const tournamentViewDiv = document.getElementById("tournament_view");
	const boardDiv = tournamentViewDiv?.querySelector("#board") as HTMLDivElement;
	const gameScreenDiv = tournamentViewDiv?.querySelector("#tournamentGamescreenDiv") as HTMLDivElement;
	boardDiv!.classList.add("hidden");
	gameScreenDiv!.classList.remove("hidden");
	clearInterval(playersIntervalId);
	clearInterval(tournamentsIntervalId);
	init_game(pong);
});

pong.on("score", (e: any) => {
	const e1 = document.getElementById("player1Score");
	const e2 = document.getElementById("player2Score");
	const e1_final = document.getElementById("finalScore1");
	const e2_final = document.getElementById("finalScore2");
	e1 && (e1.textContent = e.score1.toString());
	e2 && (e2.textContent = e.score2.toString());
	e1_final && (e1_final.textContent = e.score1.toString());
	e2_final && (e2_final.textContent = e.score2.toString());
});

pong.on("victory", (e: any) => {
	const tournamentViewDiv = document.getElementById("tournament_view");
	const onlineViewDiv = document.getElementById("play_online_view");
	const aiViewDiv = document.getElementById("ai_view");
	const localViewDiv = document.getElementById("local_view");

	if ((location.hash.slice(1) || "") == "play/tournament") {
		const gameScreenDiv = tournamentViewDiv?.querySelector("#tournamentGamescreenDiv") as HTMLDivElement;
		const scoresEndDiv = tournamentViewDiv?.querySelector("#scoresEnd") as HTMLDivElement;
		const boardDiv = tournamentViewDiv?.querySelector("#board") as HTMLDivElement;

		switchFromDiv1ToDiv2(gameScreenDiv, scoresEndDiv);
		setTimeout(() => {
			switchFromDiv1ToDiv2(scoresEndDiv, boardDiv);
		}, 4000);
	} else if ((location.hash.slice(1) || "") == "play/online") {
		const gameScreenDiv = onlineViewDiv?.querySelector("#game") as HTMLDivElement;
		const scoresEndDiv = onlineViewDiv?.querySelector("#scoresEnd") as HTMLDivElement;
		const boardDiv = onlineViewDiv?.querySelector("#room") as HTMLDivElement;

		switchFromDiv1ToDiv2(gameScreenDiv, scoresEndDiv);
		setTimeout(() => {
			switchFromDiv1ToDiv2(scoresEndDiv, boardDiv);
		}, 4000);
	} else if ((location.hash.slice(1) || "") == "play/ia") {
		const gameScreenDiv = aiViewDiv?.querySelector("#gameScreenDiv") as HTMLDivElement;
		const scoresEndDiv = aiViewDiv?.querySelector("#scoresEnd") as HTMLDivElement;
		const countDownDiv = aiViewDiv?.querySelector("#countDownDiv") as HTMLDivElement;

		switchFromDiv1ToDiv2(gameScreenDiv, scoresEndDiv);
		const ria = document.getElementById("ria");
		ria?.addEventListener("submit", (e) => {
			e.preventDefault();
			switchFromDiv1ToDiv2(scoresEndDiv, gameScreenDiv);
			launchGame(pong, gameScreenDiv, countDownDiv, "0", true);
		});
	} else {
		const gameScreenDiv = localViewDiv?.querySelector("#gameScreenDiv") as HTMLDivElement;
		const scoresEndDiv = localViewDiv?.querySelector("#scoresEnd") as HTMLDivElement;
		const countDownDiv = localViewDiv?.querySelector("#countDownDiv") as HTMLDivElement;

		switchFromDiv1ToDiv2(gameScreenDiv, scoresEndDiv);
		const rlocal = document.getElementById("rlocal");
		rlocal?.addEventListener("submit", (e) => {
			e.preventDefault();
			switchFromDiv1ToDiv2(scoresEndDiv, gameScreenDiv);
			launchGame(pong, gameScreenDiv, countDownDiv);
		});
		// IF WE KEEP TIME OUT WE NEED TO CANCEL IT IF WE START A NEW GAME MAYBE USE A RETURN BUTTON INSTEAD ??
		// setTimeout(() => {
		// 	scoresEndDiv.classList.add("hidden");
		// 	window.location.hash = "#play";
		// }, 8000);
	}
});
