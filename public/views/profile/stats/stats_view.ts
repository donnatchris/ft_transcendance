export const Stats = (): string => `
<div id="stats_view" class="h-full">
	<div id="stats-ok" class="h-full hidden">
		<div class="h-[90%] w-full flex flex-row items-center justify-center gap-4">
			<div id="camembertDiv" class="h-full font-press-start text-xl text-white">
				<canvas id="canvasCamembert" class="h-full" width="500" height="500">
				</canvas>
			</div>
			<div class="h-[97%] w-px bg-white"></div>
			<div id="matchHistoryDiv" class="h-full flex flex-col">
				<p class="h-[10%] text-3xl font-tomorrow font-bold white">
					MATCHES HISTORY
				</p>
				<div id="historyData" class="h-[80%] text-base font-press-start white overflow-y-auto">
				</div>
			</div>
		</div>
		<nav class="h-[10%] button-bar left-0 w-full flex items-center justify-between gap-4 flex-wrap">
			<a href="#profile/dashboard" class="font-tomorrow bg-white text-black font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl border border-white px-3 py-1 rounded-lg">
				Dashboard
			</a>
			<a href="#profile/stats" class="font-tomorrow bg-white text-black font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl border border-white px-3 py-1 rounded-lg">
				Stats
			</a>
			<a href="#profile/friends" class="font-tomorrow bg-white text-black font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl border border-white px-3 py-1 rounded-lg">
				Friends
			</a>
		</nav>
	</div>
	<div id="stats-ko" class="hidden">
		<div class="flex flex-col items-start">
			<p class="font-press-start text-xl text-red-400">You must be logged in to access this section</p>
			<p class="font-press-start text-xl text-white">Please register or log in</p>
			<p class="font-press-start text-xl text-white blink">&gt;</p>
		</div>
	</div>
</div>
`;