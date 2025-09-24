export const ModifyAvatar = (): string => `
<div id="avatar-ok" class="h-full hidden">
    <div class="h-full flex flex-col items-start">
    	<p class="h-[10%] font-press-start text-xl text-white">Modify my avatar<br><br></p>
    	<form id="avatarForm" enctype="multipart/form-data" method="POST" class="h-[80%] font-press-start text-xl text-white"
        	action="/gate/user/avatar_upload">
        	<input type="file" name="file" accept="image/png, image/jpeg, image/webp" required class="text-xs file:text-base file:px-2 file:py-1 file:text-white file:font-press-start file:border file:border-white">
        	<button type="submit" class="border border-white">Upload</button>
		</form>
    	<div id="text_to_insert" class="h-[10%] font-press-start text-xl text-white">
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
<div id="avatar-ko" class="hidden">
    <div class="flex flex-col items-start">
      	<p class="font-press-start text-xl text-red-400">You must be logged in to access this section</p>
      	<p class="font-press-start text-xl text-white">Please register or log in</p>
      	<p class="font-press-start text-xl text-white blink">&gt;</p>
    </div>
</div>
`;