import { pong } from "../../../Pong.Instance.js";
import { initGame, launchGame } from "../../../utils/game.js";

export async function addPlayVsIAEvents() {
	const playAIDiv = document.getElementById("ai_view") as HTMLDivElement;
	if (!playAIDiv) {
		return;
	}
	const gameScreenDiv = playAIDiv.querySelector("#gameScreenDiv") as HTMLDivElement;
	const countDownDiv = playAIDiv.querySelector("#countDownDiv") as HTMLDivElement;
	const buttonDiv = playAIDiv.querySelector("#button_join_div");
	try {
		await initGame(pong, gameScreenDiv);
		const fia = document.getElementById("fia");
		fia!.addEventListener("submit", (e) => {
			e.preventDefault();
			buttonDiv?.classList.add("hidden");
			launchGame(pong, gameScreenDiv, countDownDiv, "0", true);
		});
	} catch (e) {
		console.error("Error: ", e);
	}
}
