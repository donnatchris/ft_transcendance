import { getMyWinsAndLosses } from "../../../utils/getters.js";

function drawText(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, pivotAngle: number, centerX: number, centerY: number, radius: number, wins: number, losses: number){
	const percentWins = Math.round((wins / (wins + losses)) * 100);
	const percentLosses = 100 - percentWins;
	const midAngleWins = pivotAngle / 2;
	const midAngleLosses = midAngleWins + Math.PI;
	const textRadius = (radius + radius / 2) / 2;
	const textWinsX = centerX + Math.cos(midAngleWins) * textRadius;
	const textWinsY = centerY + Math.sin(midAngleWins) * textRadius;
	const textLossesX = centerX + Math.cos(midAngleLosses) * textRadius;
	const textLossesY = centerY + Math.sin(midAngleLosses) * textRadius;

	ctx.save();
	ctx.font = "bold 32px Tomorrow, Arial, sans-serif";
	ctx.fillStyle = "#fff";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.shadowColor = "black";
	ctx.shadowBlur = 4;
	if (wins > 0)
		ctx.fillText(`${percentWins}%`, textWinsX, textWinsY);
	if (losses > 0)
		ctx.fillText(`${percentLosses}%`, textLossesX, textLossesY);
	ctx.restore();
}

function drawLegends(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, colorWins: string, colorLosses: string){
	const padding = 20;
  	const squareSize = 18;
  	const gapY = 10;
  	const textOffsetX = 8;
  	const fontSize = 16;
  	ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  	ctx.textBaseline = "top";
  	ctx.textAlign = "left";

  	ctx.fillStyle = colorWins;
  	ctx.fillRect(padding, padding, squareSize, squareSize);
  	ctx.fillStyle = "#fff";
  	ctx.fillText("Wins", padding + squareSize + textOffsetX, padding);

  	ctx.fillStyle = colorLosses;
  	ctx.fillRect(padding, padding + squareSize + gapY, squareSize, squareSize);
  	ctx.fillStyle = "#fff";
  	ctx.fillText("Losses", padding + squareSize + textOffsetX, padding + squareSize + gapY);
}


export async function drawCamembert(profile: any, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement){
	const centerX = canvas.width / 2;
	const centerY = canvas.height / 2;
	const stats = await getMyWinsAndLosses();
	const wins = stats ? stats.wins : 0;
	const losses = stats ? stats.losses : 0;
	const radius = 0.9 * canvas.height / 2;
	const pivotAngle = (wins / (wins + losses)) * 2 * Math.PI;
	const colorWins = "rgba(22, 129, 137, 0.99)";
	const colorLosses = "rgba(196, 182, 37, 0.99)";

	ctx.beginPath();
	ctx.moveTo(centerX, centerY);
	ctx.arc(centerX, centerY, radius, (2 * Math.PI) / 200, pivotAngle - (2 * Math.PI) / 200, false);
	ctx.closePath();
	ctx.fillStyle = colorWins;
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(centerX, centerY);
	ctx.arc(centerX, centerY, radius, pivotAngle, 2 * Math.PI, false);
	ctx.closePath();
	ctx.fillStyle = colorLosses;
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(centerX, centerY);
	ctx.arc(centerX, centerY, radius / 2, 0, 2 * Math.PI, false);
	ctx.closePath();
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fill();

	drawText(ctx, canvas, pivotAngle, centerX, centerY, radius, wins, losses);
	drawLegends(ctx, canvas, colorWins, colorLosses);

	ctx.restore();
}

// save
// export function drawCamembert(profile: any, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement){
// 	const centerX = canvas.width / 2;
// 	const centerY = canvas.height / 2;
// 	const wins = profile.win;
// 	const losses = profile.loose;
// 	const radius = 0.9 * canvas.height / 2;
// 	const pivotAngle = (wins / (wins + losses)) * 2 * Math.PI;
// 	const colorWins = "rgba(22, 129, 137, 0.99)";
// 	const colorLosses = "rgba(196, 182, 37, 0.99)";

// 	ctx.beginPath();
// 	ctx.moveTo(centerX, centerY);
// 	ctx.arc(centerX, centerY, radius, (2 * Math.PI) / 200, pivotAngle - (2 * Math.PI) / 200, false);
// 	ctx.closePath();
// 	ctx.fillStyle = colorWins;
// 	ctx.fill();
	
// 	ctx.beginPath();
// 	ctx.moveTo(centerX, centerY);
// 	ctx.arc(centerX, centerY, radius, pivotAngle, 2 * Math.PI, false);
// 	ctx.closePath();
// 	ctx.fillStyle = colorLosses;
// 	ctx.fill();

// 	ctx.beginPath();
// 	ctx.moveTo(centerX, centerY);
// 	ctx.arc(centerX, centerY, radius / 2, 0, 2 * Math.PI, false);
// 	ctx.closePath();
// 	ctx.fillStyle = "rgb(0, 0, 0)";
// 	ctx.fill();

// 	drawText(ctx, canvas, pivotAngle, centerX, centerY, radius, wins, losses);
// 	drawLegends(ctx, canvas, colorWins, colorLosses);

// 	ctx.restore();
// }