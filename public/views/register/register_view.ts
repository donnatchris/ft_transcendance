export const Register = (): string => `
  <div class="h-full">
  <div class="h-full flex flex-col items-start">

    <form id="loginForm" class="flex flex-col items-start space-y-4">
	  <div id="error-message" class="errordiv"></div>
      <label for="loginInput" class="font-press-start text-xl text-white">
        Register<br><br>Choose your login
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
        type="submit"
        class="mt-4 font-press-start text-base text-white bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 transition"
      >
        Next
      </button>
    </form>

    <form id="emailForm" class="flex flex-col items-start space-y-4 hidden">
	  <div id="error-message" class="errordiv"></div>
      <label for="emailInput" class="font-press-start text-xl text-white">
        Register<br><br>Enter your email
      </label>
      <div class="flex items-center">
        <span class="font-press-start text-xl text-white blink mr-2">&gt;</span>
        <input
          id="emailInput"
          name="email"
          type="email"
          required
          class="bg-transparent border-b border-white text-white font-press-start text-xl focus:outline-none px-2 py-1"
          placeholder="Your email"
        />
      </div>
      <button
        type="submit"
        class="mt-4 font-press-start text-base text-white bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 transition"
      >
        Next
      </button>
    </form>

	<form id="passwordForm" class="flex flex-col items-start space-y-4 hidden">
	  <div id="error-message" class="errordiv"></div>
      <label for="passwordInput" class="font-press-start text-xl text-white">
        Register<br><br>
        Must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be 8 to 20 characters long.
        <br><br>Choose a password
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
	  	id="buttonNextPassword"
        type="submit"
        class="mt-4 font-press-start text-base text-white bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 transition"
      >
        Next
      </button>
    </form>

	<form id="confirmPasswordForm" class="flex flex-col items-start space-y-4 hidden">
	  <div id="error-message" class="errordiv"></div>
      <label for="confirmPasswordInput" class="font-press-start text-xl text-white">
        Confirm your password
      </label>
      <div class="flex items-center">
        <span class="font-press-start text-xl text-white blink mr-2">&gt;</span>
        <input
          id="confirmPasswordInput"
          name="confirmPassword"
          type="password"
          required
          class="bg-transparent border-b border-white text-white font-press-start text-xl focus:outline-none px-2 py-1"
          placeholder="Confirm your password"
        />
      </div>
      <button
        type="submit"
        class="mt-4 font-press-start text-base text-white bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 transition"
      >
        Next
      </button>
    </form>

	<form id="display_nameForm" class="flex flex-col items-start space-y-4 hidden">
	  <div id="error-message" class="errordiv"></div>
      <label for="display_nameInput" class="font-press-start text-xl text-white">
        Register<br><br>Choose a display name
      </label>
      <div class="flex items-center">
        <span class="font-press-start text-xl text-white blink mr-2">&gt;</span>
        <input
          id="display_nameInput"
          name="display_name"
          type="text"
          required
          class="bg-transparent border-b border-white text-white font-press-start text-xl focus:outline-none px-2 py-1"
          placeholder="Choose a display name"
        />
      </div>
      <button
        type="submit"
        class="mt-4 font-press-start text-base text-white bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 transition"
      >
        Next
      </button>
    </form>

	<div id="results" class="hidden">
		<div id="error-message" class="text-red-400 font-press-start text-xl errordiv"></div>
		<div id="success-message" class="text-green-400 font-press-start text-xl successdiv"></div>
	</div>

  </div>
</div>
`;