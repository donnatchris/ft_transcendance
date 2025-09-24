import { REGEX, ERROR } from '../../../const/const.js';
import { LoginDataObject } from '../../../const/types.js';
import { showError, showSuccess, showErrorInDiv, showSuccessInDiv } from '../../../utils/show.js';
import { getUser, getProfile, deleteMe } from '../../../utils/getters.js'
import { patchModifyData } from '../../../utils/posters.js';

export function askForPassword(): Promise<string> {
  return new Promise((resolve) => {
    const modal = document.createElement('div');

    modal.className = "fixed inset-0 flex items-center justify-center z-50 font-tomorrow font-bold";
    modal.innerHTML = `
    <div class="absolute inset-0" style="background: rgba(255, 255, 255, 0.5);"></div>
		<div class="relative bg-black rounded shadow-lg w-[50%] p-4 z-10 border-2 border-yellow-600 flex flex-col justify-center">
			<label class="block mb-2 text-white">Please enter your password :</label>
			<input id="confirmOldPasswordID" type="password" placeholder="your password" title="change my password" class="m-4 max-w-1/2 text-white"/>
			<div class="w-full justify-center flex flex-row gap-10">
				<button id="simpleCancelBtn" class="px-3 py-1 bg-red-600 text-white rounded">
					Cancel
				</button>
				<button id="simpleOkBtn" class="px-3 py-1 bg-green-400 text-white rounded">
					Confirm
				</button>
        </div>
    </div>
    `;
    document.body.appendChild(modal);

    const input = document.getElementById('confirmOldPasswordID') as HTMLInputElement;
    const okBtn = document.getElementById('simpleOkBtn') as HTMLButtonElement;
    const cancelBtn = document.getElementById('simpleCancelBtn') as HTMLButtonElement;

    function close(val: string) {
      	document.body.removeChild(modal);
      	resolve(val);
    }

    okBtn.onclick = () => close(input.value);
    cancelBtn.onclick = () => close('');
    input.onkeydown = (e) => {
      if (e.key === 'Enter') okBtn.click();
      if (e.key === 'Escape') cancelBtn.click();
    };
    input.focus();
  });
}

async function dealProfileChanges(login: string, displayName: string, email: string, password: string, confirmPassword: string, profile: any): Promise<string> {
	if ((password != '' || confirmPassword != '') && password != confirmPassword)
		return ('Passwords do not match');
	if ((login != '' && login != profile.login) || (displayName != '' && displayName != profile.display_name) || (email != '' && email != profile.email) || password != '')
	{
		let status: string = '';
		const pass = await askForPassword();
		if (login != '' && login != profile.login){
			status += '\nlogin: ' + await patchModifyData('login', login, pass);
		}
		if (displayName != '' && displayName != profile.display_name){
			status += '\ndisplay name: ' + await patchModifyData('display_name', displayName, pass);
		}
		if (email != '' && email != profile.email){
			status += '\nemail: ' + await patchModifyData('email', email, pass);
		}
		if (password != '' && login != profile.login){
			status += '\npassword: ' + await patchModifyData('password', password, pass);
		}
		const user = await getUser();
		const loginBoxLogin = document.getElementById("loginBoxLogin");
		if (loginBoxLogin && user){
			loginBoxLogin.textContent = user?.login;
		}
		return (status);
	} else {
		return ('No changes to save');
	}
}

export async function addDashboardEvents() {
	const user = await getUser();
	
	const profileOkDiv = document.getElementById('dashboard-ok');
	const profileKoDiv = document.getElementById('dashboard-ko');
	if (profileOkDiv && profileKoDiv)
	{
		if (!user) {
			profileKoDiv.classList.remove('hidden');
		} else {
			profileOkDiv.classList.remove('hidden');
			
			let profile = await getProfile();
			const avatarPath = profile.avatar?.trim() || "/img/default.png";
			const avatarUrl = avatarPath !== "/img/default.png" ? `/gate/user/avatar_get?path=${avatarPath}` : avatarPath;

			document.getElementById('avatar_to_insert')!.innerHTML = `
			<a href="#profile/avatar" title="modifier mon image de profil" class="block w-[10vw] h-[10vw] overflow-hidden rounded-full bg-gray-800">
  				<img src="${avatarUrl}" alt="Avatar" class="w-full h-full object-cover" />
			</a>
			`;
			
			const passwordField = document.getElementById('passwordID')! as HTMLInputElement;
			const confirmPasswordField = document.getElementById('confirmPasswordID')! as HTMLInputElement;
			const profileDiv = document.getElementById('profileDiv')!;
			const loginField = document.getElementById('loginID')! as HTMLInputElement;
			const displayNameField = document.getElementById('displayNameID')! as HTMLInputElement;
			const emailField = document.getElementById('emailID')! as HTMLInputElement;
			const button = document.getElementById('saveChangesButton')!;

			loginField.placeholder = profile.login;
			displayNameField.placeholder = profile.display_name;
			emailField.placeholder = profile.email;

			const profileForm = document.getElementById('profileForm')! as HTMLFormElement;
			profileForm.addEventListener('submit', async (event) => {
    			event.preventDefault();
				const results = await dealProfileChanges(loginField.value, displayNameField.value, emailField.value, passwordField.value, confirmPasswordField.value, profile)
				console.log('results: ', results);
				loginField.value = '';
				displayNameField.value = '';
				emailField.value = '';
				passwordField.value = '';
				confirmPasswordField.value = '';
				profile = await getProfile();
				loginField.placeholder = profile.login;
				displayNameField.placeholder = profile.display_name;
				emailField.placeholder = profile.email;

				const messageDiv = document.getElementById('resultModify')!;
				messageDiv.textContent = results;
				messageDiv.classList.remove('hidden');
  				setTimeout(() => {
    				messageDiv.classList.add('hidden');
					messageDiv.textContent = '';
  				}, 3000);

			});
		}
	}
	const deleteAccountButton = document.getElementById("deleteAccountButton");
	if (deleteAccountButton){
		deleteAccountButton.addEventListener("click", async () => {
			const modalDelete = document.createElement('div');
    		modalDelete.className = "fixed inset-0 flex items-center justify-center z-50 font-tomorrow font-bold";
			modalDelete.innerHTML = `
			<div class="absolute inset-0" style="background: rgba(255, 255, 255, 0.5);"></div>
				<div class="relative bg-black rounded shadow-lg w-[50%] p-4 z-10 border-2 border-yellow-600 flex flex-col justify-center">
				<p class="font-tomorrow font-bold text-white">
				Are you sure you want to delete your account? All your data will be deleted from our servers, there is no way back
				</p>
				<div class="w-full justify-center flex flex-row gap-10">
					<button id="cancelButton" class="px-3 py-1 bg-green-400 text-white rounded">
						Cancel
					</button>
					<button id="deleteButtonConfirm" class="px-3 py-1 bg-red-600 text-white rounded">
						Delete my account
					</button>
				</div>
			</div>
			`;
			document.body.appendChild(modalDelete);

    		const cancelButton = modalDelete.querySelector("#cancelButton") as HTMLButtonElement;
    		const deleteButtonConfirm = modalDelete.querySelector("#deleteButtonConfirm") as HTMLButtonElement;

    		if (cancelButton && deleteButtonConfirm) {
      			cancelButton.onclick = () => document.body.removeChild(modalDelete);
      			deleteButtonConfirm.onclick = async () => {
        			document.body.removeChild(modalDelete);
					const pass = await askForPassword();
        			const res = await deleteMe(pass);
					setTimeout(() => {
      					window.location.hash = "";
   					 }, 2000);
      			};
    		}
		});
	}
}
