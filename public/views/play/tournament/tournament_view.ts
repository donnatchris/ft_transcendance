export const Tournament = (): string => `
<div id="tournament_view" class="h-full flex flex-col items-center">
    <div id="default" class="h-full w-full flex flex-col items-start">
		<div id="tournamentsRoomLogs" class="text-xl font-press-start hidden">
		</div>
    	<form id="create">
            <input
                id="tournid"
                name="tourn"
                type="text"
                required
                class="bg-transparent border-b border-white text-white font-press-start text-xl focus:outline-none px-2 py-1"
                placeholder="tournament name"
                />
			<button type="submit" class="border border-white border-r-0 rounded-l">Create game</button>
		</form>
      	<div id="tournaments" class="h-[90%] w-full font-press-start text-xl text-white overflow-y-auto">
	    </div>
    </div>

	<div id="tournamentWaitingRoom" class="h-[80%] w-full max-w-lg mx-auto mt-8 px-8 py-6 rounded-2xl border-2 border-[#3b3b4f] shadow-xl flex flex-col items-start gap-5 font-tomorrow text-neutral-100">
		<div id="tournamentWaitingRoomTitle" class="w-full text-3xl font-tomorrow font-bold text-cyan-300 border-b-2 border-cyan-300 pb-2 mb-1 tracking-wide">
    	</div>

    	<div id="tournamentWaitingRoomData" class="h-[60%] w-full text-base font-tomorrow text-neutral-100">
    	</div>

    	<div id="lockTournamentDiv" class="w-full hidden">
        	<button type="submit" id="lockTournamentButton" class="font-tomorrow font-bold text-xl text-white border-2 border-cyan-300 cursor-pointer cursorrounded-lg px-7 py-3 transition transform hover:bg-cyan-300 hover:text-[#23234b] hover:scale-105 shadow-cyan-200/10 shadow-md">
            	Lock the players
        	</button>
    	</div>

		<div id="lockMessage" class="w-full font-tomorrow font-bold text-xl text-gray-400 hidden">
        	please wait for the team to be locked
    	</div>
	</div>

    <div id="board" class="h-full flex flex-row gap-4 hidden">
		<div id="canvasTournamentCountdownDiv" class="w-full h-full justify-center hidden">
			<canvas id="tournamentCountdownCanvas" class="aspect-square h-full w-full justify-center items-center" width="500" height="500">
			</canvas>
		</div>
		<div id="drawnDiv" class="w-full h-full flex flex-row gap-4 justify-center">
			<div id="tournamentDiv" class="h-full aspect-square font-press-start text-xl text-white">
				<canvas id="canvasTournament" class="h-full" width="500" height="500">
				</canvas>
			</div>
			<div class="h-full w-px bg-white"></div>
			<div id="tournamentSection" class="h-full flex flex-col">
				<p id="tournamentName" class="h-[10%] text-3xl font-tomorrow font-bold white">
				</p>
				<p id="phaseName" class="h-[10%] text-xl font-tomorrow font-bold white">
				</p>
				<div id="tournamentData" class="h-[80%] text-base font-press-start white">
				</div>
			</div>
		</div>
  	</div>

	<div id="tournamentGamescreenDiv" class="h-full hidden">
	  	<div class="h-[20%] flex items-center justify-between font-press-start text-xl gap-4">
		  	<div class="flex flex-col items-center">
			  	<span id="leftUser">PLAYER 1</span>
			  	<span id="player1Score" class="font-tomorrow font-bold text-6xl">0</span>
		  	</div>
		  	<div class="flex flex-col items-center">	
			  	<span id="rightUser">PLAYER 2</span>
			  	<span id="player2Score" class="font-tomorrow font-bold text-6xl">0</span>
		  	</div>
	  	</div>
	  	<div id="tournamentCanvasFrame" class="h-[80%] justify-center items-center">
	  	</div>
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

	<div id="canvasTournamentCountdownDiv" class="w-full h-full justify-center hidden">
	  	<canvas id="tournamentCountdownCanvas" class="aspect-square h-full w-full justify-center items-center" width="500" height="500">
	  	</canvas>
	</div>
</div>
`;