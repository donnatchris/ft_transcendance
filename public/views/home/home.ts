import { displayMessage } from "../../utils/show.js";
import { getUser } from "../../utils/getters.js";

export async function addHomeEvents() {
	const currentViewDiv = document.getElementById("home_view");
	const homeForm = currentViewDiv!.querySelector('#homeForm');
	const messageDiv = currentViewDiv!.querySelector('#error-message') as HTMLDivElement;
	const homeInput = homeForm!.querySelector('#homeInput') as HTMLInputElement;
	const user = await getUser();

	let homeValue = '';
  
	if (homeForm) {
		(document.getElementById('homeInput') as HTMLInputElement).focus();
		homeForm.addEventListener('submit', function (e) {
			e.preventDefault();
			homeValue = (document.getElementById('homeInput') as HTMLInputElement).value.trim();

			if (homeValue === "what is the secret?") {
				displayMessage("42", messageDiv, "success");
			} else if (homeValue.toLowerCase() === "login") {
				if (!user){
					window.location.hash = "login";
				} else {
					displayMessage("You are already logged in.", messageDiv, "failure");
				}
			} else if (homeValue.toLowerCase() === "register") {
				if (!user){
					window.location.hash = "register";
				} else {
					displayMessage("You need to log out first.", messageDiv, "failure");
				}
			} else if (homeValue.toLowerCase() === "play") {
				if (user){
					window.location.hash = "play";
				} else {
					displayMessage("You are not allowed to acces this section, please login or register first.", messageDiv, "failure");
				}
			}
			else if (homeValue.toLowerCase() === "credit") {
				if (user){
					window.location.hash = "credit";
				} else {
					displayMessage("You are not allowed to acces this section, please login or register first.", messageDiv, "failure");
				}
			}
			else if (homeValue.toLowerCase() === "profile") {
				if (user){
					window.location.hash = "profile/dashboard";
				} else {
					displayMessage("You are not allowed to acces this section, please login or register first.", messageDiv, "failure");
				}
			}
			else if (homeValue.toLowerCase() === "policy") {
				window.location.hash = "policy";
			}
			else {
				displayMessage("command not found.", messageDiv, "failure");
			}
			homeInput!.value = "";
		}
	)};
}