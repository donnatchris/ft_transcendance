import { TournamentRunner } from '../../../game/TournamentRunner.js';
import type { Tournament } from "@transcendance/types";
import { getUser, getTournamentsList, getTournament, addPlayer, lockAndStartTournament, runNewRound } from '../../../utils/getters.js'
import { drawCanvas } from './tournament_canvas.js';
import { fillDataTournament } from './tournament_data.js';
import { createTournament } from '../../../utils/posters.js';
import { findAvatar, loadImage } from './tournament_canvas.js';
import { pong } from '../../../Pong.Instance.js';
import { initTournamentGame } from '../../../utils/game.js';
import { switchFromDiv1ToDiv2 } from '../../../utils/show.js';

export let tournamentIntervalId: any | null = null;
export let playersIntervalId: any | null = null;
export let tournamentsIntervalId: any | null = null;

export function tournamentCleanup() {
	if (tournamentIntervalId) {
		clearInterval(tournamentIntervalId);
		tournamentIntervalId = null;
	}
	if (playersIntervalId) {
		clearInterval(playersIntervalId);
		playersIntervalId = null;
	}
	if (tournamentsIntervalId) {
		clearInterval(tournamentsIntervalId);
		tournamentsIntervalId = null;
	}
}

async function findMatchId(tournament: any): Promise<string | null>{
	const User = await getUser();
	if (!User){
		return (null);
	}
	const roundInd = 2 - tournament.currentRound;
	const currentRound = tournament.roundArray[roundInd];
	for (let i = 0; i < currentRound.matchArray.length; i++){
		if ((currentRound.matchArray[i].playerArray[0].player.id == User.id_user) || (currentRound.matchArray[i].playerArray[1].player.id == User.id_user)){
			return (currentRound.matchArray[i].roomId);
		}
	}
	return (null);
}

//display 

async function switchToGameScreen(tournament: any){
	const waitingRoomDiv = document.getElementById("tournamentWaitingRoom") as HTMLDivElement;
	const countDownDiv = document.getElementById("canvasTournamentCountdownDiv") as HTMLDivElement;
	const gameScreenDiv = document.getElementById("tournamentGamescreenDiv") as HTMLDivElement;
	if (!waitingRoomDiv || !gameScreenDiv || !countDownDiv){
		return;
	}
	const roomId = await findMatchId(tournament);
	if (!roomId){
		return;
	}
	await initTournamentGame(pong, gameScreenDiv, roomId);
	waitingRoomDiv.classList.add("hidden");
	countDownDiv.classList.remove("hidden");

	countDownDiv.classList.add("hidden");
	gameScreenDiv.classList.remove("hidden");
}

function printLogs(type: "error" | "success", message: string){
	const tournamentsLogs = document.getElementById("tournamentsRoomLogs") as HTMLDivElement;
	if (!tournamentsLogs){
		return;
	}
	tournamentsLogs.textContent = message;
	if (type === "error"){
		tournamentsLogs.classList.add("text-red-400");
	}else{
		tournamentsLogs.classList.add("text-green-400");
	}
	tournamentsLogs.classList.remove("hidden");
	setTimeout(() => {
		tournamentsLogs.textContent = "";
		if (type === "error"){
			tournamentsLogs.classList.remove("text-red-400");
		}else{
			tournamentsLogs.classList.remove("text-green-400");
		}
		tournamentsLogs.classList.add("hidden");
	}, 1500);
}

function formatTournament(tournaments: any[]): string {
    if (!tournaments || !Array.isArray(tournaments) || tournaments.length === 0) {
        return "<p class='text-center text-gray-400'>Aucun tournoi disponible</p>";
    }

    return `
        <div class="space-y-2">
            <h3 class="font-press-start text-lg mb-4">Tournois (${tournaments.length}):</h3>
            ${tournaments.map((tournament) => {
				const nbPlayers = numberOfPlayers(tournament);
				const roomId = tournament.name;
				const isFull = nbPlayers >= 8;
                console.debug("Tournament object:", tournament);
                return `
                    <div class="room-item border border-white p-2 rounded hover:bg-gray-800 transition-colors ${isFull ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}" data-tournament-id="${roomId}" isfull="${isFull}">
                        <p class="text-white">📋 ${tournament.name}</p>
                        <p class="text-gray-300 text-xs">${tournament.created_at || 'Date inconnue'}</p>
						<p class="${isFull ? 'text-red-400' : 'text-green-400'} text-sm">
                                👥 ${nbPlayers}/8 joueurs
                            </p>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

async function formatPlayers(tournament: any) {
    if (!tournament || !tournament.playerArray || tournament.playerArray.length === 0) {
        return "<p class='text-center text-gray-400'>No player yet in the tournament</p>";
    } else {
        const playerHtmlList = await Promise.all(
            tournament.playerArray.map(async (player: any) => {
                const avatar = await loadImage(findAvatar(player));
				if (!avatar)
					return;
				avatar.className = "h-full w-auto max-h-full rounded-full object-cover";
                return `
                    <div class="h-[12%] room-item flex items-center gap-4 border border-white p-2 rounded bg-gray-900/70 mb-2">
                        ${avatar.outerHTML}
                        <span class="font-tomorrow text-lg text-white">${player.display_name}</span>
                    </div>
                `;
            })
        );
        return playerHtmlList.join('');
    }
}

// events

async function doesTournamentExist(name: string): Promise<boolean>{
	const tournament = await getTournament(name);
	if (tournament)
		return (true);
	return (false);
}

export function numberOfPlayers(tournament: any): number{
	if (!tournament || !tournament.playerArray || !Array.isArray(tournament.playerArray))
		return (0);
	let size = 0;
	for (let i = 0; i < tournament.playerArray.length; i++){
		if (tournament.playerArray[i] && tournament.playerArray[i] != ''){
			size++;
		}
	}
	return (size);
}

async function buildTournamentPage(tournament: any){

	clearInterval(playersIntervalId);
	await fillDataTournament(tournament);
    await drawCanvas(tournament);
	const user = await getUser();
	if (user && user.id_user == tournament.created_by.id){
		setTimeout(async () => {
			tournament = await runNewRound(tournament.name); //je lance le premier round

		},10000);
	}
	tournament = await getTournament(tournament.name);

	tournamentIntervalId = setInterval(async () => {
		const updatedTournament = await getTournament(tournament.name);
		if (updatedTournament != tournament)
		{
			await fillDataTournament(updatedTournament);
    		await drawCanvas(updatedTournament);
		}
	}, 5000);
}

export async function buildWaitingRoom(name: string){
	let tournament = await getTournament(name);
	if (!tournament){
		return;
	}

	const waitingRoomDiv = document.getElementById("tournamentWaitingRoom") as HTMLDivElement;
	if (!waitingRoomDiv){
		return;
	}
	const title = waitingRoomDiv.querySelector("#tournamentWaitingRoomTitle")!;
	const data = waitingRoomDiv.querySelector("#tournamentWaitingRoomData")!;

	waitingRoomDiv.classList.remove("hidden");

	const user = await getUser();
	const lockTournamentDiv = document.getElementById("lockTournamentDiv")!;
	const lockMessageDiv = document.getElementById("lockMessage")!;
	const lockTournamentButton = document.getElementById("lockTournamentButton")!;
	const board = document.getElementById('board');
	if (!board){
		return;
	}

	title.textContent = tournament.name;
	let locked: boolean = false;
	if (locked === false && user.id_user === tournament.created_by.id && numberOfPlayers(tournament) < 8){
		lockTournamentDiv.classList.remove("hidden");
		lockTournamentButton.addEventListener('click', async (e) => {
			tournament = await lockAndStartTournament(tournament.name);
			locked = true;
			lockTournamentDiv.classList.add("hidden");
			waitingRoomDiv.classList.add("hidden");
			board!.classList.remove('hidden');
			await buildTournamentPage(tournament);
		});
	} else {
		lockMessageDiv.classList.remove("hidden");
	}
	playersIntervalId = setInterval(async() => {
		tournament = await getTournament(tournament.name);
		data.innerHTML = await formatPlayers(tournament);
		if (numberOfPlayers(tournament) == 8){
			switchFromDiv1ToDiv2(waitingRoomDiv, board as HTMLDivElement);
			await buildTournamentPage(tournament);
		}
	}, 1000);
}

async function addRoomClickListeners() {
    const roomItems = document.querySelectorAll('.room-item');
    roomItems.forEach(async (roomDiv) => {
		if (!roomDiv.getAttribute('data-tournament-id')){
			return;
		}
		const thisTournament = await getTournament(roomDiv.getAttribute('data-tournament-id')!);
		if (!thisTournament){
			return;
		} else {
			const nbPlayers = numberOfPlayers(thisTournament);
        	const roomId = thisTournament.name;

        	if (nbPlayers < 8)
            {
                roomDiv.addEventListener('click', async (e) => {
                    if (roomId) {
                        const board = document.getElementById('board');
                        if (board) {
                            const home = document.getElementById('default');
                            if (home) {
                                home.classList.add('hidden');
                            }
							await addPlayer(thisTournament.name);
							await buildWaitingRoom(thisTournament.name);
                        }
                    }
                });
            }
            roomDiv.addEventListener('mouseenter', () => {
                roomDiv.classList.add('bg-gray-700', 'border-green-400');
            });
            
            roomDiv.addEventListener('mouseleave', () => {
                roomDiv.classList.remove('bg-gray-700', 'border-green-400');
            });
		}
    });
}
    
async function updateList()
{
	const tournamentsList = await getTournamentsList();
	const tournaments = document.getElementById("tournaments");
    if (tournaments && tournamentsList) {
        tournaments.innerHTML = formatTournament(tournamentsList);
        addRoomClickListeners();
	}
}

export async function addTournamentEvents() {
    try {
		const waitingRoomDiv = document.getElementById("tournamentWaitingRoom") as HTMLDivElement;
		waitingRoomDiv!.classList.add("hidden");
        await updateList();
        const create = document.getElementById("create");
        create!.addEventListener("submit", async (e) => {
            e.preventDefault();
            const tournidinput = document.getElementById("tournid") as HTMLInputElement;
            const tin = tournidinput?.value || "";
			console.log("tin = ", tin);
			const tournamentExists = await doesTournamentExist(tin);
			if (tournamentExists == true){
				printLogs("error", "Tournament " + tin + " already exists");
			} else {
				const res = await createTournament(tin);
				if (res === null) {
					printLogs("error", "You have already created a tournament or you are not logged in");
				} else {
					printLogs("success", "Created tournament: " + tin);
				}
                // await updateList();
			}
        });  
		tournamentsIntervalId = setInterval(async() => {
			await updateList();
		}, 1000);
    } catch (error) {
		printLogs("error", error as string);
    }
}

