import { getUser } from '../../../utils/getters.js'
import { pong } from '../../../Pong.Instance.js';
import { GameRoomInfo } from '@transcendance/types/index.js';
import { PongApp } from '../../../game/PongApp.js';

async function formatGamesList(gamesList: string): Promise<string> {
	const user = await getUser();
	const user_id = user.id_user;
    if (!gamesList) {
        return "<p class='text-center text-gray-400'>Aucune room disponible</p>";
    }

    if (Array.isArray(gamesList)) {
		let data = gamesList.map((room: GameRoomInfo, index) => {
			const playerCount = room.players?.length || 0;
			const maxPlayers = room.max;
			const mode = room.mode
			const registered = room.players.some((player => player.id === user_id)) // joueur actuel dans la partie
			const hasIA = room.players.some((player => player.id === 0)) // ia presente dans la partie
			const isFull = playerCount >= maxPlayers && !registered;
			return { id: room.id, playerCount, maxPlayers, registered, isFull, hasIA, mode}
		}).sort((a, b) => {
			if (a.registered !== b.registered) {
				return a.registered ? -1 : 1;
			}
			if (a.isFull !== b.isFull) {
				return a.isFull ? 1 : -1;
			}
			return a.id < b.id ? -1 : 1;
		})
		data = data.filter((item) => item.mode == "remote")
        return `
            <div class="space-y-2">
                <h3 class="font-press-start text-lg mb-4">Rooms (${gamesList.length}):</h3>
                ${data.map((item) => {
                    return `
                        <div class="room-item border border-white p-2 rounded hover:bg-gray-800 transition-colors ${item.isFull ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}" data-room-id="${item.id}" isfull="${item.isFull}">
                            <p><strong>${item.id}</strong></p>
                            <p class="${item.isFull ? 'text-red-400' : 'text-green-400'} text-sm">
                                👥 ${item.playerCount}/${item.maxPlayers} joueurs
                            </p>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    return `<p>${gamesList}</p>`;
}

function addRoomClickListeners(pong: PongApp) {
    const roomItems = document.querySelectorAll('.room-item');
    roomItems.forEach((roomDiv) => {
		const isfull = roomDiv.getAttribute('isfull');
		const roomId = roomDiv.getAttribute('data-room-id') ?? "";
		if (isfull === 'false')
			{
				roomDiv.addEventListener('click', async (e) => {
				if (roomId) {
					pong.join(roomId);
					await init_game(pong);
					const playOk = document.getElementById('play-ok');
					const gameDiv = document.getElementById('game');
					if (playOk && gameDiv) {
						const roomListContainer = document.getElementById('room');
						if (roomListContainer) {
							roomListContainer.classList.add('hidden');
						}
						gameDiv.classList.remove('hidden');
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
    });
}

export async function updateGamesList(pong: PongApp) {
    const listFrame = document.getElementById('listFrame');
    const gamesList = await pong.listGame();
	
    if (listFrame) {
		listFrame.innerHTML = await formatGamesList(gamesList);
        addRoomClickListeners(pong);
    }
}

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
	
	const canvasFrame = document.getElementById('canvasFrame');
	if (canvasFrame) {
		canvasFrame.appendChild(pong.canvas);
	}
}


export async function waitingroom(pong: PongApp, roomId: string): Promise<void> {
	let intervalId: NodeJS.Timeout
  	return new Promise<void>((resolve, reject) => {
    const waitingDiv = document.getElementById("waiting");
    if (!waitingDiv) {
      reject();
      return;
    }

    const update = async () => {
      try {
        const roominfo = await pong.getGame(roomId);
        if (!roominfo) {
          reject();
          clearInterval(intervalId);
          return;
        }

        const currentPlayers = roominfo.players?.length || 0;
        const maxPlayers = roominfo.max;

        waitingDiv.classList.remove("hidden");
        waitingDiv.innerHTML = `
          <div class="text-center p-4 border border-white rounded">
            <h3 class="font-press-start text-lg mb-2">${roomId}</h3>
            <p class="text-green-400">👥 ${currentPlayers}/${maxPlayers} joueurs connectés</p>
            ${
              currentPlayers < maxPlayers
                ? '<p class="text-yellow-400 mt-2">⏳ En attente d\'un autre joueur...</p>'
                : '<p class="text-green-400 mt-2">✅ Partie prête à commencer !</p>'
            }
          </div>
        `;

        if (currentPlayers >= maxPlayers) {
          clearInterval(intervalId);
          waitingDiv.classList.add("hidden");
          resolve();
        }
      } catch (err) {
        clearInterval(intervalId);
        reject(err);
      }
    };

    intervalId = setInterval(update, 500);
	window.addEventListener("hashchange", () => clearInterval(intervalId), {once: true});
    update();
  });
}


export async function addPlayOnlineEvents() {
    const user = await getUser();
    const playOk = document.getElementById('play-ok');
    const playKo = document.getElementById('play-ko');

    if (user) {
        if (playOk) {
            playOk.classList.remove('hidden');
            try {
                await updateGamesList(pong);
                
                const create = document.getElementById("create");
                create!.addEventListener("submit", async (e) => {
                    e.preventDefault();
                    const roomIdInput = document.getElementById("roomid") as HTMLInputElement;
                    const roomId = roomIdInput?.value || "";
                    await pong.newGame("remote", false, roomId);``
                    await init_game(pong);
                    pong.join(roomId);
                    const gameDiv = document.getElementById('game');
                    if (gameDiv) {
						const roomListContainer = document.getElementById('room');
                        if (roomListContainer) {
							roomListContainer.classList.add('hidden');
                        }
						waitingroom(pong, roomId).then(() => gameDiv.classList.remove('hidden'))
                        //gameDiv.classList.remove('hidden')
                    }
                    await updateGamesList(pong);
                });
                
            } catch (e) {
                console.error("Erreur lors de l'instanciation de PongApp:", e);
            }
        }
    } else {
        if (playKo) {
            playKo.classList.remove('hidden');
        }
    }
}
