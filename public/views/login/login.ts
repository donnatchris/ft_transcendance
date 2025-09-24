import { LoginDataObject } from '../../const/types.js';
import { pong } from '../../Pong.Instance.js';
import { getUser, postLogin } from '../../utils/getters.js';
import { displayMessage } from '../../utils/show.js';

export async function addLoginEvents() {

	const currentViewDiv = document.getElementById('login_view');
	const loginForm = currentViewDiv!.querySelector("#loginForm");
	const passwordForm = currentViewDiv!.querySelector("#passwordForm");
	const messageDiv = currentViewDiv!.querySelector("#message") as HTMLDivElement;

	let user = await getUser();
	if (user){
		displayMessage("You are already logged in!", messageDiv, "failure");
		setTimeout(() => {
    	 	window.location.hash = "#profile/dashboard";
  		}, 2000);
		return;
	}

	loginForm?.classList.remove("hidden");

	let loginValue = '';
  
	if (loginForm && passwordForm) {

	  loginForm.addEventListener('submit', function (e) {
		e.preventDefault();
		loginValue = (currentViewDiv?.querySelector("#loginInput") as HTMLInputElement).value.trim()
		const buttonNext = currentViewDiv?.querySelector("#loginNextButton")!;
		buttonNext.classList.add("hidden");
		passwordForm.classList.remove('hidden');
		(document.getElementById('passwordInput') as HTMLInputElement).focus();
	  });
  
	  passwordForm.addEventListener('submit', async function (e) {
		e.preventDefault();
		const passwordValue = (currentViewDiv?.querySelector("#passwordInput") as HTMLInputElement).value.trim();
		const identifier = (currentViewDiv?.querySelector("#loginInput") as HTMLInputElement).value.trim();
		const data: LoginDataObject = { identifier, plainPassword: passwordValue };
		const result = await postLogin(data, messageDiv);
		if (!result){
			(currentViewDiv?.querySelector("#passwordInput") as HTMLInputElement).value = "";
			(currentViewDiv?.querySelector("#loginInput") as HTMLInputElement).value = "";
			(currentViewDiv?.querySelector("#loginInput") as HTMLInputElement).focus();
			return;
		} else {
			loginForm.classList.add("hidden");
			passwordForm.innerHTML = `<span class="font-press-start text-xl text-green-400">Welcome, ${loginValue} !</span>`;
		 	pong.reconnect();
		 	window.heartbeat?.start();
		 	user = await getUser();
		 	if (user){
		 		setTimeout(() => {
    	 			window.location.hash = "#profile/dashboard";
  		 		}, 2000);
		 	}
		}
	  });
	}
  }

