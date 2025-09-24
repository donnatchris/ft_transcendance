export const ModifyProfile = (): string => `
  <div id="play-ok" class="relative h-screen hidden">
	<div class="flex flex-col items-start">
	  <p class="font-press-start text-xl text-white">Modify Profile</p>
	  <p class="font-press-start text-xl text-white blink">&gt;</p>
	</div>
  </div>
  <div id="play-ko" class="hidden">
    <div class="flex flex-col items-start">
      <p class="font-press-start text-xl text-red-400">You must be logged in to access this section</p>
	  <p class="font-press-start text-xl text-white">Please register or log in</p>
      <p class="font-press-start text-xl text-white blink">&gt;</p>
    </div>
  </div>
`;