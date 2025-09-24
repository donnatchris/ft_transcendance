import { getUser, getLogout } from './utils/getters.js';

export async function addLoginBoxEvents() {
	let user = await getUser();
	if (!user) {

		// console.log("[PUBLIC: getUser] No user found, displaying login box.");

    	document.getElementById('loginBox')!.innerHTML = `
		<img src="/img/boutonrouge.png" alt="Image" class="h-[74px] aspect-square object-cover object-bottom" />
	
		<div class="flex flex-col ml-[5%] space-y-2">
    		<a href="#register" class="flex flex-col ml-[5%] space-y-2 bg-yellow-800 text-yellow-600 rounded font-tomorrow text-center px-4 shadow-lg transition transform hover:scale-105 hover:shadow-2xl">
				<span class="embossed mb-1 text-xs sm:text-sm md:text-base lg:text-lg text-center">
					Register
		  		</span>
			</a>
    		<a href="#login" class="flex flex-col ml-[5%] space-y-2 bg-yellow-800 text-yellow-600 rounded font-tomorrow text-center px-4 shadow-lg transition transform hover:scale-105 hover:shadow-2xl">
				<span class="embossed mb-1 text-xs sm:text-sm md:text-base lg:text-lg text-center">
					Login
				</span>
			</a>
		</div>
		`;
	}
	else {
    	document.getElementById('loginBox')!.innerHTML = `
		<img src="/img/boutonvert.png" alt="Image" class="h-[74px] aspect-square object-cover object-bottom" />
	
		<div class="flex flex-col ml-[5%] space-y-2">
    		<a href="#profile/dashboard" class="flex flex-col ml-[5%] space-y-2 bg-yellow-800 text-yellow-600 rounded font-tomorrow text-center px-4 shadow-lg transition transform hover:scale-105 hover:shadow-2xl">
				<span id="loginBoxLogin" class="embossed mb-1 text-xs sm:text-sm md:text-base lg:text-lg text-center">
                	${user.login}
            	</span>
			</a>
    		<a id="logout" class="flex flex-col ml-[5%] space-y-2 bg-yellow-800 text-yellow-600 rounded font-tomorrow text-center px-4 shadow-lg transition transform hover:scale-105 hover:shadow-2xl">
				<span class="embossed mb-1 text-xs sm:text-sm md:text-base lg:text-lg text-center">
					Logout
				</span>
			</a>
		</div>
		`;
		document.getElementById('navbar')!.innerHTML = `
			<a href="#" class="transition duration-300 ease-in-out transform hover:scale-105 font-tomorrow font-bold text-lg sm:text-2xl lg:text-3xl xl:text-4xl border border-white px-2 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg flex-1 text-center max-w-100 min-w-0">
				<span class="block truncate">Home</span>
			</a>
			<a href="#play"
				class="transition duration-300 ease-in-out transform hover:scale-105 font-tomorrow font-bold text-lg sm:text-2xl lg:text-3xl xl:text-4xl border border-white px-2 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg flex-1 text-center min-w-0">
				<span class="block truncate">Play</span>
			</a>

			<a href="#profile/dashboard"
				class="transition duration-300 ease-in-out transform hover:scale-105 font-tomorrow font-bold text-lg sm:text-2xl lg:text-3xl xl:text-4xl border border-white px-2 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg flex-1 text-center min-w-0">
				<span class="block truncate">Profile</span>
			</a>

			<a href="#credit" class="transition duration-300 ease-in-out transform hover:scale-105 font-tomorrow font-bold text-lg sm:text-2xl lg:text-3xl xl:text-4xl border border-white px-2 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg flex-1 text-center min-w-0">
				<span class="block truncate">Credit</span>
			</a>`;
		setTimeout(() => {
			const logoutBtn = document.getElementById('logout');
			if (logoutBtn) {
				logoutBtn.addEventListener('click', async () => {
					await getLogout();
					window.location.hash = "";
					await addLoginBoxEvents();
					document.getElementById('navbar')!.innerHTML=`
					<a href="#" class="transition duration-300 ease-in-out transform hover:scale-105 font-tomorrow font-bold text-lg sm:text-2xl lg:text-3xl xl:text-4xl border border-white px-2 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg flex-1 text-center max-w-100 min-w-0">
						<span class="block truncate">Home</span>
					</a>`;
				});
			}
		}, 1500);
	}
}

