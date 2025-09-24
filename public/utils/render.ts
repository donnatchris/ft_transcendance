import { addFriendsEvents } from "../views/profile/friends/friends.js";

function button(label: string, className: string, onClick: any) {
			const b = document.createElement('button');
			b.type = 'button';
			b.textContent = label;
			b.className = className;
			b.addEventListener('click', onClick);
			return b;
}

function statusClass(s: string) {
	if (!s) return '';
	const low = (String(s) || '').toLowerCase();
	if (low === 'online') return 'status online';
	if (low === 'in game') return 'status in game';
	return 'status offline';
}

export function renderRows(users: any, WTI: HTMLElement, wins?: boolean) {
	WTI.innerHTML = '';
	if (Array.isArray(users)){
		if (users.length === 0) {
			WTI.textContent = "Nobody here for now 🥲";
		} else {
			for (const u of users || []) {
				const tr = document.createElement('tr');

				// const tdId = document.createElement('td');
				// tdId.textContent = u.id_user;
				// tr.appendChild(tdId);

				const tdAvatar = document.createElement('td');
				const img = document.createElement('img');
				img.className = 'h-[3vh] aspect-square object-cover';
				img.alt = 'avatar';
				const avatarPath = u.avatar?.trim() || "/img/default.png";
				img.src = avatarPath !== "/img/default.png" ? `/gate/user/avatar_get?path=${avatarPath}` : avatarPath;
				tdAvatar.appendChild(img);
				tr.appendChild(tdAvatar);

				const tdName = document.createElement('td');
				tdName.textContent = u.display_name ?? '';
				tdName.className = "pl-4"
				tr.appendChild(tdName);

				if (wins){
					const tdStats = document.createElement('td');
					if (!u.win || !u.loose){
						tdStats.textContent = `🏆0 💀0`;
					} else {
						tdStats.textContent = `🏆${u.win} 💀${u.loose}`;
					}
					tdStats.className = "pl-4"
					tr.appendChild(tdStats);
				}

				const tdStatus = document.createElement('td');
				tdStatus.textContent = 'o';
				
				if ((u.status || '').toLowerCase() === 'online'){
					tdStatus.className = 'pl-4 text-green-400';
				} else if ((u.status || '').toLowerCase() === 'in game'){
					tdStatus.className = 'pl-4 text-blue-400';
				} else {
					tdStatus.className = 'pl-4 text-red-400';
				}
				tr.appendChild(tdStatus);

				WTI.appendChild(tr);
			}
		}
	}
}

function getRequestId(u: any) {
			// tolère différents noms de propriété au cas où : request_id, requestId, id, etc.
			return u.request_id ?? u.requestId ?? u.id ?? u.req_id;
		}

export function renderRequestRows(users: any[], WTI: HTMLElement, sendAnswer: (row: HTMLTableRowElement, requestId: string | number, answer: string) => void): void
{
	WTI.innerHTML = '';
	if (Array.isArray(users)){
		if (users.length === 0) {
			WTI.textContent = "Nobody here for now 🥲";
		} else {
			for (const u of users || []) {
				const tr = document.createElement('tr');

				const requestId = getRequestId(u); // requis pour PATCH
				if (requestId == null) {
					// si la donnée ne contient pas de request_id, on ignore la ligne
					continue;
				}

				// const tdId = document.createElement('td');
				// tdId.textContent = u.id_user;
				// tr.appendChild(tdId);

				const tdAvatar = document.createElement('td');
				const img = document.createElement('img');
				img.className = 'h-[3vh] aspect-square object-cover';
				img.alt = 'avatar';

				const avatarPath = u.avatar?.trim() || "/img/default.png";
				img.src = avatarPath !== "/img/default.png" ? `/gate/user/avatar_get?path=${avatarPath}` : avatarPath;
				tdAvatar.appendChild(img);
				tr.appendChild(tdAvatar);

				const tdName = document.createElement('td');
				tdName.textContent = u.display_name ?? '';
				tdName.className = "pl-4"
				tr.appendChild(tdName);

				const tdActions = document.createElement('td');
				tdActions.className = 'row-actions';

                const acceptImg = document.createElement('img');
                acceptImg.src = '/img/coche.png';
                acceptImg.alt = '';
                acceptImg.className = 'btn-accept inline-block h-[2vh] aspect-square cursor-pointer mx-1';
                acceptImg.title = 'Accepter';
                acceptImg.addEventListener('click', () => {
					sendAnswer(tr, requestId, 'accepted');
					addFriendsEvents();
				});

                const declineImg = document.createElement('img');
                declineImg.src = '/img/croix.png';
                declineImg.alt = '';
                declineImg.className = 'btn-decline inline-block h-[2vh] aspect-square cursor-pointer mx-1';
                declineImg.title = 'Refuser';
                declineImg.addEventListener('click', () => {
					sendAnswer(tr, requestId, 'declined');
					addFriendsEvents();
				});

                tdActions.appendChild(acceptImg);
                tdActions.appendChild(declineImg);

				tr.appendChild(tdActions);

				WTI.appendChild(tr);
			}
		}
	}
}

//Countdown

function drawCircles(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement){
	const centerX = canvas.width / 2;
	const centerY = canvas.height / 2;

	ctx.beginPath();
	ctx.arc(centerX, centerY, 100, 0, 2 * Math.PI);
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(251, 251, 251, 0.99)";
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(centerX, centerY, 80, 0, 2 * Math.PI);
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(251, 251, 251, 0.99)";
	ctx.stroke();
}

function drawWhiteCross(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {

	let grad = ctx.createLinearGradient(canvas.width / 2, 0, canvas.width / 2, canvas.height);
	grad.addColorStop(0, 'rgba(255,255,255,0)');
	grad.addColorStop(0.5, 'rgba(255,255,255,1)');
	grad.addColorStop(1, 'rgba(255,255,255,0)');

	ctx.strokeStyle = grad;
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.stroke();

	grad = ctx.createLinearGradient(0, canvas.height / 2, canvas.width, canvas.height / 2);
	grad.addColorStop(0, 'rgba(255,255,255,0)');
	grad.addColorStop(0.5, 'rgba(255,255,255,1)');
	grad.addColorStop(1, 'rgba(255,255,255,0)');

	ctx.strokeStyle = grad;
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(0, canvas.height / 2);
	ctx.lineTo(canvas.width, canvas.height / 2);
	ctx.stroke();
}

function drawNumber(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, n: number){
	ctx.font = "bold 120px Arial";
  	ctx.textAlign = "center";
  	ctx.textBaseline = "middle";
  	ctx.fillStyle = "#fff";
  	ctx.shadowColor = "#000";
  	ctx.shadowBlur = 10;
  	ctx.fillText(String(n), canvas.width / 2, canvas.height / 2);
  	ctx.shadowBlur = 0;
}

function drawText(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, text: string){
	ctx.font = "bold 120px Arial";
  	ctx.textAlign = "center";
  	ctx.textBaseline = "middle";
  	ctx.fillStyle = "#fff";
  	ctx.shadowColor = "#000";
  	ctx.shadowBlur = 10;
  	ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  	ctx.shadowBlur = 0;
}

function drawGradLine(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, x1: number, y1: number, x2: number, y2: number) {
	let grad = ctx.createLinearGradient(x1, y1, x2, y2);
	grad.addColorStop(0, 'rgba(123, 123, 123, 0.53)');
	grad.addColorStop(1, 'rgba(123, 123, 123, 0)');

	ctx.strokeStyle = grad;
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function interceptCanvasEdge(centerX: number, centerY: number, angle: number, width: number, height: number): {x: number, y: number} {
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    let t = Infinity;

    // Limite gauche
    if (dx !== 0) {
        const t1 = (0 - centerX) / dx;
        if (t1 > 0) t = Math.min(t, t1);
    }
    // Limite droite
    if (dx !== 0) {
        const t2 = (width - centerX) / dx;
        if (t2 > 0) t = Math.min(t, t2);
    }
    // Limite haute
    if (dy !== 0) {
        const t3 = (0 - centerY) / dy;
        if (t3 > 0) t = Math.min(t, t3);
    }
    // Limite basse
    if (dy !== 0) {
        const t4 = (height - centerY) / dy;
        if (t4 > 0) t = Math.min(t, t4);
    }

    const x = centerX + t * dx;
    const y = centerY + t * dy;

    return {x, y};
}

function drawShadow(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, step: number){
	const centerX = canvas.width / 2;
	const centerY = canvas.height / 2;
	const angle = step * (2 * Math.PI) / 100;
	const {x, y} = interceptCanvasEdge(centerX, centerY, angle, canvas.width, canvas.height);
	drawGradLine(ctx, canvas, centerX, centerY, x, y);
}

function printOneFrame(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, n: number, step: number){
	// ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawCircles(ctx, canvas);
	drawWhiteCross(ctx, canvas);
	drawShadow(ctx, canvas, step);
	drawNumber(ctx, canvas, n);
}

function drawFrame(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, n: number, onFinish?: () => void) {
	let i = 100;
	function step() {
		printOneFrame(ctx, canvas, n, i);
		if (i > 0) {
			setTimeout(() => {
				i--;
				step();
			}, 10);
		} else {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			if (onFinish) onFinish();
		}
	}
	step();
}

export function drawCountDown(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
	drawFrame(ctx, canvas, 3, () => {
		drawFrame(ctx, canvas, 2, () => {
			drawFrame(ctx, canvas, 1, () => {
				drawText(ctx, canvas, "START!");
				setTimeout(() => {
					ctx.clearRect(0, 0, canvas.width, canvas.height);
				}, 500);
			});
		});
	});
	
}