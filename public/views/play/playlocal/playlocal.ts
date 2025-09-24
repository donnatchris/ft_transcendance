import { pong } from "../../../Pong.Instance.js";
import { initGame, launchGame } from "../../../utils/game.js";

export async function addPlayLocalEvents() {
	const playLocalDiv = document.getElementById("local_view") as HTMLDivElement;
	if (!playLocalDiv) {
		return;
	}
	const gameScreenDiv = playLocalDiv.querySelector("#gameScreenDiv") as HTMLDivElement;
	const countDownDiv = playLocalDiv.querySelector("#countDownDiv") as HTMLDivElement;
	const buttonDiv = playLocalDiv.querySelector("#button_join_div");
	try {
		await initGame(pong, gameScreenDiv);
		const flocal = document.getElementById("flocal");
		flocal!.addEventListener("submit", (e) => {
			e.preventDefault();
			buttonDiv?.classList.add("hidden");
			launchGame(pong, gameScreenDiv, countDownDiv);
		});
	} catch (e) {
		console.error("Error: ", e);
	}
}
