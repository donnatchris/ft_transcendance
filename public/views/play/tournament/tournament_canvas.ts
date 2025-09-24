import { getUser } from '../../../utils/getters.js';

//Utils
export function findAvatar(user: any): string{
	if (user === null)
		return ("/img/default.png");
	const avatarPath = user.avatar?.trim() || "/img/default.png";
	const avatarUrl = avatarPath !== "/img/default.png" ? `/gate/user/avatar_get?path=${avatarPath}` : avatarPath;
	return (avatarUrl);
}

export function loadImage(url: string): Promise<HTMLImageElement|null> {
    return new Promise((resolve) => {
        if (!url) return resolve(null);
        const img = new window.Image();
        img.crossOrigin = 'anonymous'; // si besoin
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = url;
    });
}

// //Drawing

async function drawUnknownAvatar(circleInd: number, match: any, x: number, y: number, playerNb: number, tournament: any, currentRound: any, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement){
	let Radius = 25;
	let color = "rgba(251, 251, 251, 0.99)"; 
	if (circleInd == currentRound){
		color = "rgba(145, 235, 235, 0.88)";
	} else if (circleInd > currentRound){
		color = "rgba(67, 74, 80, 0.88)";
	} else {
		color = "rgba(251, 251, 251, 0.99)";
	}
	ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, Radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.clip();
	let img = await loadImage("/img/unknownplayer.png");
	if (!img)
		return;
	ctx.globalAlpha = 0.6; //transparence
	ctx.drawImage(img, x - Radius, y - Radius, Radius * 2, Radius * 2);
	ctx.globalAlpha = 1;
    ctx.restore();
	const displayName = "unknown"
    ctx.save();
    ctx.font = "14px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
	ctx.strokeStyle = "#222"; 
    ctx.strokeText(displayName, x, y + Radius + 6);
    ctx.fillText(displayName, x, y + Radius + 6);
    ctx.restore();
}

async function drawAvatar(user: any, circleInd: number, match: any, x: number, y: number, playerNb: number, tournament: any, player: any, currentRound: any, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement){
	let Radius = 25;
	const radiusUser = Radius + 8;
	const currentUserColor = "rgba(144, 238, 144, 0.88)";
	let color: string;
	if (circleInd == currentRound){
		color = "rgba(145, 235, 235, 0.88)";
	} else if (circleInd > currentRound){
		color = "rgba(67, 74, 80, 0.88)";
	} else {
		color = "rgba(251, 251, 251, 0.99)";
	}
	let clipRadius = (player && user.id_user === player.id && circleInd == currentRound) ? radiusUser : Radius;
	ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, clipRadius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.clip();
	let img;
	if (player == null || player.avatar === "")
	{
		img = await loadImage("/img/default.png");
	} else {
		img = await loadImage(findAvatar(player));
	}
	if (!img)
		return;
	// si le cercle sur lequel on est en train de dessiner est celui d une phase a venir
	if (circleInd < currentRound && ((playerNb == 1 && match.playerArray[0].isAi == true) || (playerNb == 2 && match.playerArray[1].isAi == true))){ //alors on affiche une image en particulier, et on la met en tranparence
		img = await loadImage("/img/unknownplayer.png");
		if (!img)
			return;
		ctx.globalAlpha = 0.6; //transparence
		ctx.drawImage(img, x - Radius, y - Radius, Radius * 2, Radius * 2);
		ctx.globalAlpha = 1;
	// si le match qu'on dessine est termine et qu on est en train de dessiner l a vatar du perdant
	} else if (match.status === "done" && ((playerNb == 1 && match.winner.id == match.playerArray[1].player.id) || (playerNb == 2 && match.winner.id == match.playerArray[0].player.id))){
        ctx.globalAlpha = 0.6;
		// si on dessine l utilisateur actuel
		if (player && user.id_user === player.id && circleInd == currentRound){
			ctx.drawImage(img, x - radiusUser, y - radiusUser, radiusUser * 2, radiusUser * 2);
		} else {
			ctx.drawImage(img, x - Radius, y - Radius, Radius * 2, Radius * 2);
		}
		ctx.globalAlpha = 1;
	// ou bien le match est termine et on dessine le gagnant
	} else {
		if (player && user.id_user === player.id && circleInd == currentRound){
			ctx.drawImage(img, x - radiusUser, y - radiusUser, radiusUser * 2, radiusUser * 2);
		} else {
			ctx.drawImage(img, x - Radius, y - Radius, Radius * 2, Radius * 2);
		}
	}
    ctx.restore();

	// on dessine le contour de l avatar
	// si le cercle sur lequel on dessine correspond au round en cours
	if (circleInd == currentRound){
		ctx.setLineDash([])
		ctx.beginPath();
		
		if (player && user.id_user === player.id){
			ctx.arc(x, y, radiusUser, 0, 2 * Math.PI);
			ctx.strokeStyle = currentUserColor;
			ctx.lineWidth = 3;
		} else {
			ctx.arc(x, y, Radius, 0, 2 * Math.PI);
			ctx.strokeStyle = "rgba(145, 235, 235, 0.88)";
			ctx.lineWidth = 3;
		}
		ctx.stroke();
	}

	let displayName = player.display_name;
	if (displayName.length > 20) {
    	displayName = displayName.slice(0, 20) + "...";
	}
	let score;
	if (playerNb == 1)
		score = match.playerArray[0].score;
	else
		score = match.playerArray[1].score;
    ctx.save();
    ctx.font = "12px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
	ctx.strokeStyle = "#222";          // Contour sombre pour la lisibilité
    ctx.strokeText(displayName + ': ' + score, x, y + Radius + 6);
    ctx.fillText(displayName + ': ' + score, x, y + Radius + 6);
    ctx.restore();
}

function drawMatch(
	user: any,
	circleInd: number,
	matchInd: any,
	x1: number,
	y1: number,
	angle: number,
	radius: number,
	tournament: any,
	currentRound: number,
	ctx: CanvasRenderingContext2D,
	canvas: HTMLCanvasElement)
{
	let color = "rgba(251, 251, 251, 0.99)";
	let width = 2;
	const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
	ctx.setLineDash([])
	ctx.beginPath();

	let arcLength: number;
	if (circleInd == 2){
  		arcLength = Math.PI / 4;
		ctx.arc(centerX, centerY, radius, angle, angle + arcLength);
	} else if (circleInd == 1){
  		arcLength = Math.PI / 2;
		ctx.arc(centerX, centerY, radius, angle, angle + arcLength);
	} else {
  		arcLength = Math.PI;
		ctx.moveTo(x1, y1);
		ctx.lineTo(x1 - radius * 2, y1);
	}

	if (circleInd == currentRound){
		width = 3;
		color = "rgba(145, 235, 235, 0.88)";
	} else if (circleInd > currentRound){
		width = 2;
		color = "rgba(67, 74, 80, 0.88)";
	} else {
		width = 2;
		color = "rgba(251, 251, 251, 0.99)";
	}
	ctx.lineWidth = width;
	ctx.strokeStyle = color;
	ctx.stroke();
}

async function drawCircle(user: any, circleInd: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, tournament: any){
	const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let avatarCount;
	let round: number;
	let radius: number;
	let currentRound = -1;
	if (tournament.phase == "final"){
		currentRound = 0;
	} else if (tournament.phase == "semi"){
		currentRound = 1;
	} else if (tournament.phase == "quarter"){
		currentRound = 2;
	}
	if (circleInd == 2) {
		radius = 220;
		avatarCount = 8;
	} else if (circleInd == 1) {
		radius = 150;
		avatarCount = 4;
	} else {
		radius = 80;
		avatarCount = 2;
	}
	let matchId = 0;
	const angleStep = (2 * Math.PI) / avatarCount;
	const angleStart = angleStep / 2;
		
	for (let i = 0; i < avatarCount; i++) 
	{
        let angle = angleStart + i * angleStep - Math.PI / 2;
        let x = centerX + radius * Math.cos(angle);
        let y = centerY + radius * Math.sin(angle);

		drawMatch(user, circleInd, matchId, x, y, angle, radius, tournament, currentRound, ctx, canvas);
		if (tournament.roundArray[circleInd].matchArray[matchId].playerArray == null || tournament.roundArray[circleInd].matchArray[matchId].playerArray.length == 0 || tournament.roundArray[circleInd].matchArray[matchId].playerArray[0] == null){
			await drawUnknownAvatar(circleInd, tournament.roundArray[circleInd].matchArray[matchId], x, y, 1, tournament, currentRound, ctx, canvas);
		} else {
			await drawAvatar(user, circleInd, tournament.roundArray[circleInd].matchArray[matchId], x, y, 1, tournament, tournament.roundArray[circleInd].matchArray[matchId].playerArray[0].player, currentRound, ctx, canvas);
		}
		i++;
		angle = angleStart + i * angleStep - Math.PI / 2;
		x = centerX + radius * Math.cos(angle);
		y = centerY + radius * Math.sin(angle);
		if (tournament.roundArray[circleInd].matchArray[matchId].playerArray == null || tournament.roundArray[circleInd].matchArray[matchId].playerArray.length == 0 || tournament.roundArray[circleInd].matchArray[matchId].playerArray[1] == null){
			await drawUnknownAvatar(circleInd, tournament.roundArray[circleInd].matchArray[matchId], x, y, 2, tournament, currentRound, ctx, canvas)
		} else {
			await drawAvatar(user, circleInd, tournament.roundArray[circleInd].matchArray[matchId], x, y, 2, tournament, tournament.roundArray[circleInd].matchArray[matchId].playerArray[1].player, currentRound, ctx, canvas);
		}
		matchId++;
    }
}

async function drawCircles(user: any, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, tournament: any){
	await drawCircle(user, 2, ctx, canvas, tournament);
	await drawCircle(user, 1, ctx, canvas, tournament);
	await drawCircle(user, 0, ctx, canvas, tournament);
}

//Canvas build
export async function drawCanvas(tournament: any)
{
	const user = await getUser();
	if (!user){
		// return;
	}
	const canvas = document.getElementById('canvasTournament')! as HTMLCanvasElement;
	const ctx = canvas!.getContext('2d');
	if (!ctx) {
  		console.error("Error while drawing tournament canvas");
  		throw new Error("Canvas context missing");
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawCircles(user, ctx, canvas, tournament);
}
