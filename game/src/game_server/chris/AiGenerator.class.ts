import { AIPlayer } from "./TournamentTypes.js";

const aiNames = [
	"Paranoid Android",
	"DALL-E",
	"Siri",
	"Optimus Prime",
	"Skynet",
	"KITT",
	"T-800",
	"ChatGPT",
	"DeepSeek",
	"Ultron",
];

export class AiGenerator {

	static generateAiArray(numberNeeded: number): AIPlayer[] {
		if (numberNeeded < 1) {
			return [];
		}
		const aiArray: AIPlayer[] = [];
		for (let i = 0; i < numberNeeded; i++) {
			const id = -1 - i;
			const name = '[AI] ' + aiNames[i % aiNames.length] + (i >= aiNames.length ? ` #${Math.floor(i / aiNames.length)}` : '');
			aiArray.push({ id: id, name: name });
		}
		return aiArray;
	}

	static generateOneAi(): AIPlayer {
		const randomIndex = Math.floor(Math.random() * aiNames.length);
		const id = -1;
		const name = '[AI] ' + aiNames[randomIndex];
		return { id: id, name: name };

	}

}
