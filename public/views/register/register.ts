import { REGEX, ERROR } from '../../const/const.js';
import { RegisterDataObject } from '../../const/types.js';
import { showError, showSuccess, showErrorInDiv, showSuccessInDiv } from '../../utils/show.js';

const registerRoute = "/gate/user/register";

export function addRegisterEvents() {
	const loginForm = document.getElementById('loginForm');
	const emailForm = document.getElementById('emailForm');
	const passwordForm = document.getElementById('passwordForm');
	const confirmPasswordForm = document.getElementById('confirmPasswordForm');
	const display_nameForm = document.getElementById('display_nameForm');
	const resultDiv = document.getElementById("results");

	let loginValue = '';
	let emailValue = '';
	let passwordValue = '';
	let display_nameValue = '';
	let	avatarValue = '';
  
	if (loginForm && emailForm && passwordForm && confirmPasswordForm && display_nameForm) {
	  
		loginForm.addEventListener('submit', async function (e) {
			e.preventDefault();
			loginValue = (document.getElementById('loginInput') as HTMLInputElement).value.trim();

			if (!REGEX.login.test(loginValue)) {
				showError(ERROR.identifier, loginForm as HTMLFormElement);
				const loginInput = loginForm.querySelector('#loginInput') as HTMLInputElement;
				if (loginInput) loginInput.value = "";
				return;
			}

			// rajouter verif si le login existe deja ou pas dans la database

			loginForm.classList.add('hidden'); 
			emailForm.classList.remove('hidden');
			(document.getElementById('emailInput') as HTMLInputElement).focus();
	  	});
  
	 	emailForm.addEventListener('submit', async function (e) {
			e.preventDefault();
			emailValue = (document.getElementById('emailInput') as HTMLInputElement).value.trim();
		
			if (!REGEX.email.test(emailValue)) {
				showError(ERROR.email, emailForm as HTMLFormElement);
				const emailInput = emailForm.querySelector('#emailInput') as HTMLInputElement;
				if (emailInput) emailInput.value = "";
				return;
			  }

			// rajouter verif si l'email est deja rattache a un compte ou pas dans la database

			emailForm.classList.add('hidden'); 
			passwordForm.classList.remove('hidden');
			(document.getElementById('passwordInput') as HTMLInputElement).focus();
		});

		passwordForm.addEventListener('submit', function (e) {
			e.preventDefault();
			passwordValue = (document.getElementById('passwordInput') as HTMLInputElement).value.trim();
		
			if (!REGEX.password.test(passwordValue)) {
				showError(ERROR.password, passwordForm as HTMLFormElement);
				const passwordInput = passwordForm.querySelector('#passwordInput') as HTMLInputElement;
				if (passwordInput) passwordInput.value = "";
				return;
			}

			confirmPasswordForm.classList.remove('hidden');
			const buttonNextPassword = document.getElementById("buttonNextPassword");
			if (buttonNextPassword){
				buttonNextPassword.classList.add("hidden");
			}
			(document.getElementById('confirmPasswordInput') as HTMLInputElement).focus();
		});

		confirmPasswordForm.addEventListener('submit', function (e) {
			e.preventDefault();
			const confirmPasswordValue = (document.getElementById('confirmPasswordInput') as HTMLInputElement).value.trim();

			if (passwordValue !== confirmPasswordValue) {
				showError(ERROR.passwords, confirmPasswordForm as HTMLFormElement);
				const confirmPasswordInput = confirmPasswordForm.querySelector('#confirmPasswordInput') as HTMLInputElement;
				if (confirmPasswordInput) confirmPasswordInput.value = "";
				return;
			}

			passwordForm.classList.add('hidden');
			confirmPasswordForm.classList.add('hidden');
			display_nameForm.classList.remove('hidden');
			(document.getElementById('display_nameInput') as HTMLInputElement).focus();
		});

		display_nameForm.addEventListener('submit', function (e) {
			e.preventDefault();
			display_nameValue = (document.getElementById('display_nameInput') as HTMLInputElement).value.trim();
		
			if (!REGEX.display_name.test(display_nameValue)) {
				showError(ERROR.display_name, display_nameForm as HTMLFormElement);
				const display_nameInput = display_nameForm.querySelector('#display_nameInput') as HTMLInputElement;
				if (display_nameInput) display_nameInput.value = "";
				return;
			}

			display_nameForm.classList.add('hidden');

			const data: RegisterDataObject = { login: loginValue, email: emailValue, plainPassword: passwordValue, display_name: display_nameValue, avatar: avatarValue };

			sendRegisterToBack(data, resultDiv as HTMLDivElement);
		});
	}
}

async function sendRegisterToBack(data: RegisterDataObject, div: HTMLDivElement): Promise<void> {
	console.log("[Public: register] Sending data to backend:", data);
	const jsonData = JSON.stringify(data);
	try {
	  const headers: Record<string, string> = {
		  'Content-Type': 'application/json',
	  }
	  const response = await fetch(registerRoute, {
		method: 'POST',
		headers: headers,
		body: jsonData,
	  });
	  const result = await response.json();
	  console.log("result: ", result);
	  div.classList.remove('hidden');
	  if (!response.ok || !result.success) {
		console.error("[Public: register] Error response from backend.");
		showErrorInDiv(result.message || "Unknown error", div);
		return;
	  }
	  console.log("[Public: register] User created successfully:", result);
	  showErrorInDiv("", div);
	  showSuccessInDiv("User created successfully! Redirecting...", div);
	  window.heartbeat?.start();
	  setTimeout (() => {
		window.location.hash = "#profile/dashboard";
	  }, 2000);
	}
	catch (error) {
	  console.error('[Public: register] Error during fetch:', error);
	  div.classList.remove('hidden');
	  showErrorInDiv('Failed to create user. Please try again later.', div);
	}
  }

