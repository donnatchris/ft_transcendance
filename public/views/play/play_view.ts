export const Play = (): string => `
    <div class="h-full w-full flex flex-col items-start">
      	<p class="h-[10%] font-press-start text-xl text-white">Welcome to Pong (like it's 1972) !<br><br></p>
	  	<p class="h-[80%] w-full font-press-start text-base text-white animate-fade-in">
			  You have to use the W S keys (and up down left right in local play for the second player).
			  "Play Local" and "Play vs AI" are casual matches: they won’t affect your stats.
			  "Play Online" and "Play Tournament" are competitive modes: your results will count towards your stats.
	  	</p>
	  	<nav class="h-[10%] button-bar left-0 w-full flex items-center justify-between gap-4 flex-wrap">
      		<a href="#play/local" class="font-tomorrow bg-white text-black font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl border border-white px-3 py-1 rounded-lg">
        		Play local
      		</a>
      		<a href="#play/online" class="font-tomorrow bg-white text-black font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl border border-white px-3 py-1 rounded-lg">
        		Play online
      		</a>
      		<a href="#play/ia" class="font-tomorrow bg-white text-black font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl border border-white px-3 py-1 rounded-lg">
        		Play vs AI
      		</a>
			<a href="#play/tournament" class="font-tomorrow bg-white text-black font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl border border-white px-3 py-1 rounded-lg">
        		Tournament
      		</a>
    	</nav>
    </div>
`;