export const PlayOnline = (): string => `
<div id="play_online_view">
	<div id="play-ok" class="h-full hidden">
		<div id="room" class="h-full">
			<div class="flex items-center justify-between font-press-start text-xl gap-4">
				<form id="create">
					<input
					id="roomid"
					name="room"
					type="text"
					required
					class="bg-transparent border-b border-white text-white font-press-start text-xl focus:outline-none px-2 py-1"
					placeholder="room id"
					/>
					<button type="submit" class="border border-white border-r-0 rounded-l">Create game</button>
				</form>
			</div>
				<div id="listFrame" class="justify-center m-4 overflow-y-auto h-full items-center">
				</div>
		</div>
		<div id="waiting" class="hidden">
			
		</div>
		<div id="game" class="h-full hidden">
			<div class="h-[20%] flex items-center justify-between font-press-start text-xl gap-4">
				<div class="flex flex-col items-center">
					<span id="leftUser">PLAYER 1</span>
					<span id="player1Score" class="font-tomorrow font-bold text-6xl">0</span>
				</div>
				<div class="flex flex-col items-center">	
					<span id="rightUser">PLAYER 2</span>
					<span id="player1Score" class="font-tomorrow font-bold text-6xl">0</span>
				</div>
			</div>
			<div id="canvasFrame" class="h-[80%] justify-center items-center">
			</div>
		</div>

		<div id="canvasOnlineCountdownDiv" class="w-full h-full justify-center hidden">
			<canvas id="onlineCountdownCanvas" class="aspect-square h-full w-full justify-center items-center" width="500" height="500">
			</canvas>
		</div>

		<div id="scoresEnd" class="w-full max-w-md mx-auto flex flex-col items-center space-y-6 p-6 bg-gray-900 rounded-xl border border-gray-700 hidden">
			<h2 class="font-tomorrow text-3xl text-white font-bold mb-2">Final scores</h2>
			<ul class="w-full">
				<li class="flex justify-between py-3 px-5 border-b border-gray-800 last:border-b-0">
					<span class="font-bold text-white text-lg">Player 1</span>
					<span id="finalScore1" class="font-tomorrow text-xl text-green-400 font-bold">
						
					</span>
				</li>
				<li class="flex justify-between py-3 px-5 border-b border-gray-800 last:border-b-0">
					<span class="font-bold text-white text-lg">Player 2</span>
					<span id="finalScore2" class="font-tomorrow text-xl text-gray-300 font-bold">
						
					</span>
				</li>
			</ul>
		</div>
	</div>
	<div id="play-ko" class="relative h-screen hidden">
	</div>
</div>
`;
