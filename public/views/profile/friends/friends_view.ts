export const Friends = (): string => `
<div id="friends-ok" class="h-full hidden">
	<div class="h-full flex flex-col items-start font-press-start text-xl text-white">

      	<form id="addFriendForm" class="h-[10%] font-press-start text-xl text-white flex justify-center items-center mx-auto">
			<div id="results">
				<div id="error-message" class="font-press-start text-xl text-red-400 hidden"></div>
				<div id="success-message" class="font-press-start text-xl text-green-400 hidden"></div>
			</div>
    		<input
        		id="addFriendInput"
        		type="text"
        		required
				placeholder="Invite a user"
        		class="text-base px-2 py-1 text-white font-press-start border border-white border-r-0 rounded-l placeholder-gray-400"
			>
    		<button type="submit" class="text-base px-2 py-1 bg-white text-black font-press-start border border-black border-l-0 rounded-r">
        		Add
    		</button>
		</form>

		<div class="h-[90%] left-0 w-full flex items-start justify-between gap-4 mt-4">
  			
			<div id="friends" class="w-1/3 h-full flex flex-col">
    			<p class="text-center">My friends<br><br></p>
    			<div id="friends_list_to_insert" class="text-sm flex-1 overflow-y-auto">
      				<!-- contenu -->
    			</div>
  			</div>
  			<div class="h-full w-px bg-white"></div>
 			<div id="pending_invitations" class="w-1/3 h-full flex flex-col">
    			<p class="text-center">Pending invitations<br><br></p>
    			<div id="pending_invitations_to_insert" class="text-sm flex-1 overflow-y-auto">
      				<!-- contenu -->
    			</div>
  			</div>
  			<div class="h-full w-px bg-white"></div>
  			<div id="pending_requests" class="w-1/3 h-full flex flex-col">
    			<p class="text-center">Pending requests<br><br></p>
    			<div id="pending_requests_to_insert" class="text-sm flex-1 overflow-y-auto">
      				<!-- contenu -->
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
</div>
<div id="friends-ko" class="hidden">
	<div class="flex flex-col items-start">
		<p class="font-press-start text-xl text-red-400">You must be logged in to access this section</p>
		<p class="font-press-start text-xl text-white">Please register or log in</p>
		<p class="font-press-start text-xl text-white blink">&gt;</p>
	</div>
</div>
`;

