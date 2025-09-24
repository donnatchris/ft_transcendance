export const Home = (): string => `
<div id="home_view" class="h-full">
	<div class="flex flex-col items-start w-full">
	  	<p class="font-press-start text-xl text-white w-full">Welcome to PONG (like it's 1972) !</p>
		<form id="homeForm" class="flex flex-col items-start space-y-4 w-full">
			<div id="error-message" class="errordiv"></div>
			<div id="insideform" class="flex items-center w-full">
				<span class="font-press-start text-xl text-white blink mr-2">&gt;</span>
				<input
					id="homeInput"
					name="home"
					type="text"
					required
					class="bg-transparent text-white font-press-start text-xl focus:outline-none px-2 py-1 w-full"
				/>
			</div>
		</form>
	</div>
</div>
`;
