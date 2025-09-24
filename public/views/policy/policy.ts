import { getPrivacyPolicy } from "../../utils/getters.js"

export async function addPolicyEvents(){
	const Policy = await getPrivacyPolicy();
	const Div = document.getElementById('policy');

	Div!.textContent = Policy;
}