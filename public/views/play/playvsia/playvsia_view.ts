export const PlayVsIA = (): string => `
<div id="ai_view" class="h-full w-full justify-center">

	<div id="button_join_div" class="flex items-center justify-center font-press-start text-xl gap-4 h-full">
	 	<form id="fia" class="flex items-center">
			<button type="submit" class="transition duration-300 ease-in-out transform hover:scale-105 font-tomorrow font-bold text-4xl border border-white px-6 py-3 rounded-lg">
				Play vs IA
			</button>
		</form>
	</div>

	<div id="gameScreenDiv" class="h-full hidden">
		<div class="flex items-center justify-between font-press-start text-xl gap-4">
			<div class="flex flex-col items-center">
				<span id="leftUser">PLAYER 1</span>
				<span id="player1Score" class="font-tomorrow font-bold text-6xl">0</span>
			</div>
			<div class="flex flex-col items-center">	
				<span id="rightUser">PLAYER 2</span>
				<span id="player2Score" class="font-tomorrow font-bold text-6xl">0</span>
			</div>
		</div>
		<div id="canvasFrame" class="justify-center items-center">
		</div>
	</div>
	
	<div id="countDownDiv" class="w-full h-full justify-center hidden">
		<canvas id="countDownCanvas" class="aspect-square h-full w-full justify-center items-center" width="500" height="500">
		</canvas>
	</div>

	<div id="scoresEnd" class="hidden">
		<h2 class="font-tomorrow text-3xl text-white font-bold mb-2">Final scores</h2>
  		<ul class="w-full">
    		<li class="flex justify-between py-3 px-5 border-b border-gray-800 last:border-b-0">
      			<span class="font-bold text-white text-lg">Player 1</span>
      			<span id="finalScore1" class="font-tomorrow text-xl text-green-400 font-bold">
					
				</span>
   			</li>
   			<li class="flex justify-between py-3 px-5 border-b border-gray-800 last:border-b-0">
      			<span class="font-bold text-white text-lg">Player 2</span>
      			<span id="finalScore2" class="font-tomorrow text-xl text-gray-300 font-bold"></span>
    		</li>
  		</ul>
		<form id="ria" class="flex items-center">
			<button type="submit" class="transition duration-300 ease-in-out transform hover:scale-105 font-tomorrow font-bold text-4xl border border-white px-6 py-3 rounded-lg">PLAY AGAIN?</button>
		</form>
	</div>

</div>
`;

