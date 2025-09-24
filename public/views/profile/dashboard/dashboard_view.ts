export const Dashboard = (): string => `
<div id="dashboard-ok" class="h-full hidden">
  <div class="h-full w-full flex flex-col items-start">
	<div class="h-[10%] w-full flex flex-row justify-between items-center">
    	<p class="h-full text-lg font-press-start text-xl text-white">My profile<br><br></p>
		<button id="deleteAccountButton" class="transition duration-300 ease-in-out transform hover:scale-105 bg-red-600 font-tomorrow font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white px-4 py-2 rounded">
    		Delete my account
  		</button>
	</div>
	<div id="resultModify" class="h-[80%] font-press-start text-base hidden"> 
		<!-- Resultat ici -->
	</div>
    <div class="h-[80%] flex flex-row items-center gap-8 mt-4">
		<div id="avatar_to_insert">
        	<!-- Avatar ici -->
      	</div>
		<div id="profileDiv" class="font-press-start text-xl text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
			<form id="profileForm" class="flex flex-col gap-4">
				<div>
					<label for="loginID" class="font-press-start text-xl text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
						Login: 
					</label>
					<input id="loginID" type="text" title="change my login" class="font-press-start text-xl text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl" readonly/>
				</div>
				<div>
					<label for="displayNameID" class="font-press-start text-xl text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
						Display name: 
					</label>
					<input id="displayNameID" type="text" title="change my display name" class="font-press-start text-xl text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"/>
				</div>
				<div>
					<label for="emailID" class="font-press-start text-xl text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
						Email: 
					</label>
					<input id="emailID" type="email" title="change my email" class="font-press-start text-xl text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"/>
				</div>
				<div>
					<label for="passwordID" class="font-press-start text-xl text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
						New password: 
					</label>
					<input id="passwordID" type="password" placeholder="new password" title="change my password" class="font-press-start text-xl text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"/>
				</div>
				<div>
					<label for="confirmPasswordID" class="font-press-start text-xl text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
						Confirm password: 
					</label>
					<input id="confirmPasswordID" type="password" placeholder="confirm new password" title="change my password" class="font-press-start text-xl text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"/>
				</div>
				<button id="saveChangesButton" type="submit" class="transition duration-300 ease-in-out transform hover:scale-105 font-tomorrow font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl border border-white px-6 py-3 rounded-lg">
					Save changes
				</button>
			</form>
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
<div id="dashboard-ko" class="hidden">
  <div class="flex flex-col items-start">
    <p class="font-press-start text-xl text-red-400">You must be logged in to access this section</p>
	<p class="font-press-start text-xl text-white">Please register or log in</p>
    <p class="font-press-start text-xl text-white blink">&gt;</p>
  </div>
</div>
`;