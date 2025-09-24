import { REGEX, ERROR } from '../../../const/const.js';
import { LoginDataObject } from '../../../const/types.js';
import { showError, showSuccess, showErrorInDiv, showSuccessInDiv } from '../../../utils/show.js';
import { getUser } from '../../../utils/getters.js'
import { pong } from '../../../Pong.Instance.js';
import { PongApp } from "../../../game/PongApp.js";

function formatGamesList(gamesList: string): string {
    if (!gamesList) {
        return "<p class='text-center text-gray-400'>Aucune room disponible</p>";
    }

    if (Array.isArray(gamesList)) {
        return `
            <div class="space-y-2">
                <h3 class="font-press-start text-lg mb-4">Rooms (${gamesList.length}):</h3>
                ${gamesList.map((room, index) => `
                    <div class="border border-white p-2 rounded hover:bg-gray-800 cursor-pointer" data-room-id="${room.id || index}">
                        <p><strong>Room ${room.id || index}</strong></p>
                        <p>Mode: ${room.mode || 'unknown'}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    if (typeof gamesList === 'object') {
        return `<pre class="bg-gray-800 p-4 rounded text-sm overflow-auto">${JSON.stringify(gamesList, null, 2)}</pre>`;
    }

    return `<p>${gamesList}</p>`;
}

export async function updateGamesList(pong: PongApp) {
    const listFrame = document.getElementById('listFrame');
    const gamesList = await pong.listGame();
    console.log("Raw games list:", gamesList);

    if (listFrame) {
        listFrame.innerHTML = formatGamesList(gamesList);
    }
}

export async function addRoomEvent() {
    const user = await getUser();
    const playOk = document.getElementById('play-ok');
    const playKo = document.getElementById('play-ko');
    
    if (user) {
        if (playOk)
        {
            playOk.classList.remove('hidden');
            console.log("user:", user);
            try {
                updateGamesList(pong);
                const create = document.getElementById("create");
                create!.addEventListener("submit", (e) => {
                    e.preventDefault();
                    pong.newGame("remote", false, "test");
                    updateGamesList(pong);
                });

                const join = document.getElementById("join");
                join!.addEventListener("submit", (e) => {
                    e.preventDefault();
                    pong.join("test");
                });
            } catch (e) {
                console.error("Erreur lors de l'instanciation de PongApp:", e);
            }
        }
    } else {
        if (playKo)
        {
            playKo.classList.remove('hidden');
        }
    }
}
