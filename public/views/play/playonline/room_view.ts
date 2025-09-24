export const Room = (): string => `
<div id="play-ok" class="hidden">
	<div>
	  	<div class="flex items-center justify-between font-press-start text-xl gap-4">
	 		<form id="create">
				<button type="submit" class="border border-white border-r-0 rounded-l">Create game</button>
			</form>
            <form id="join">
				<button type="submit" class="border border-white border-r-0 rounded-l">Join game</button>
			</form>
	  	</div>
          </div>
          <div id="listFrame" class="justify-center items-center">
          </div>
</div>
<div id="play-ko" class="relative h-screen hidden">
</div>
`;