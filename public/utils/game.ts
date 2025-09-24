import { drawCountDown } from "./render.js";
import { PongApp } from "../game/PongApp.js";
import { getUser } from "./getters.js";
import { updateGamesList } from "../views/play/playonline/playonline.js";

export async function initGame(pongLocal: PongApp, div: HTMLDivElement, roomId?: string){
    if (!div)
        return;
    if (roomId) {
        await pongLocal.newGame("remote", false, roomId);
    }
    const user = await getUser();
    const userDiv = div.querySelector('#current_user') as HTMLSpanElement;
    if (userDiv && user) {
        userDiv.textContent = user.display_name;
    }
    const canvasFrame = div.querySelector('#canvasFrame');
    if (canvasFrame) {
        canvasFrame.appendChild(pongLocal.canvas);
    }

    const e1 = div.querySelector("#player1Score");
    const e2 = div.querySelector("#player2Score");
    if (e1 && e2) {
        pongLocal.on("score", (e: any) => {
            e1.textContent = e.score1.toString();
            e2.textContent = e.score2.toString();
        });
    }
    pongLocal.on("victory", () => console.log("victory"));
    pongLocal.on("timeout", () => console.log("timeout"));
    return pongLocal;
}

export async function launchGame(pong: PongApp, divGame: HTMLDivElement, divCountdown: HTMLDivElement, roomId?: string, ai?: boolean) {
	if (divGame) {
		const countdownCanvas = divCountdown.querySelector("#countDownCanvas") as HTMLCanvasElement;
		if (!countdownCanvas) {
			return null;
		}
		const ctx = countdownCanvas.getContext("2d");
		if (!ctx) {
			return null;
		}
		divGame.classList.add("hidden");
		divCountdown.classList.remove("hidden");
		drawCountDown(ctx, countdownCanvas);
		setTimeout(() => {
			divCountdown?.classList.add("hidden");
			if (roomId && !ai) {
				pong.join(roomId);
			} else {
				if (ai) {
					pong.joinIa();
				} else {
					pong.joinLocal();
				}
			}
			divGame.classList.remove("hidden");
		}, 3500);
	}
	return pong;
}

export async function initTournamentGame(pong: PongApp, div: HTMLDivElement, roomId: string){

	await updateGamesList(pong);
	await pong.newGame("remote", false, roomId);

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
	const canvasFrame = div.querySelector('#tournamentGameCanvasFrame');
	if (canvasFrame) {
		canvasFrame.appendChild(pong.canvas);
	}
	pong.join(roomId);
}

