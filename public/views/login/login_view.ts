export const Login = (): string => `
<div id="login_view" class="flex flex-col items-start gap-4 space-y-8">
	<div id="message" class="hidden">
	</div>

    <form id="loginForm" class="flex flex-col items-start hidden">
		<div id="title" class="font-tomorrow font-bold text-3xl text-white">
			 Login<br><br>
		</div>
      	<label for="loginInput" class="font-press-start text-base text-white">
        	Enter your login
      	</label>
      	<div class="flex items-center">
        	<span class="font-press-start text-xl text-white blink mr-2">&gt;</span>
        	<input
          	id="loginInput"
          	name="login"
          	type="text"
          	required
          	class="bg-transparent border-b border-white text-white font-press-start text-xl focus:outline-none px-2 py-1"
          	placeholder="Your login"
        	/>
      	</div>
      	<button
	  		id="loginNextButton"
        	type="submit"
        	class="mt-4 font-press-start text-base text-white bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 transition"
      	>
        	Next
      	</button>
    </form>

    <form id="passwordForm" class="flex flex-col items-start hidden">
		<div id="title" class="font-tomorrow font-bold text-3xl text-white">
			Password<br><br>
		</div>
      	<label for="passwordInput" class="font-press-start text-base text-white">
        	Enter your password
      	</label>
      	<div class="flex items-center">
        	<span class="font-press-start text-xl text-white blink mr-2">&gt;</span>
        	<input
          		id="passwordInput"
          		name="password"
          		type="password"
          		required
          		class="bg-transparent border-b border-white text-white font-press-start text-xl focus:outline-none px-2 py-1"
          		placeholder="Your password"
        	/>
      </div>
      <button
        	type="submit"
        	class="mt-4 font-press-start text-base text-white bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 transition"
      >
        	Login
      </button>
    </form>
</div>
`;