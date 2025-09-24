import { getAllUsers } from "./getters.js";

export async function postFriend(targetUserId: number): Promise<string> {
	try {
		console.log('user Id before post: ', targetUserId);
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
	  	}
		const res = await fetch('/gate/user/friend_request', {
			method: 'POST',
			headers: headers,
			body: JSON.stringify({ targetUserId })
		});
		const data = await res.json();
		return (data.message);
	} catch (err) {
		return ('Error: ' + err);
	}
}

export async function sendAnswerPendingFriends(row: any, requestId: any, answer: any) 
{
	// désactive les boutons de la ligne pendant la requête
	const btns = row.querySelectorAll('button');
	btns.forEach((b: HTMLButtonElement) => { b.disabled = true; b.dataset.prevText = b.textContent ?? ''; b.textContent = '...'; });

	try {
		const res = await fetch('/gate/user/friend_answer', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				friendRequest: Number(requestId),
				answer: answer // 'accepted' | 'declined'
			})
		});

		let payload;
		try { payload = await res.json(); }
		catch { payload = { raw: await res.text() }; }

		const raw = document.getElementById('raw') as HTMLInputElement | HTMLTextAreaElement | null;
		if (raw) {
    		raw.value = JSON.stringify(payload, null, 2);
		}

		if (res.ok && payload && payload.success) {
			// retire la ligne si OK
			row.remove();
		} else {
			// réactive en cas d’erreur
			btns.forEach((b: HTMLButtonElement) => { b.disabled = false; b.textContent = b.dataset.prevText || b.textContent; });
			alert('La réponse a échoué : ' + (payload?.message || res.status + ' ' + res.statusText));
		}
	} catch (e) {
		btns.forEach((b: HTMLButtonElement) => { b.disabled = false; b.textContent = b.dataset.prevText || b.textContent; });
		alert('Erreur réseau: ' + String(e));
	}
}

export async function patchModifyData(data_name: string, data_value: string, password: string): Promise<string>
{
	if (data_name != 'login' && data_name != 'display_name' && data_name != 'email' && data_name != 'password')
		return ('Error: invalid field for user');
	try {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
	  	}
		const res = await fetch('/gate/user/change_user_field', {
			method: 'PATCH',
			headers: headers,
			body: JSON.stringify({ field: data_name,
				value: data_value,
				password: password })
		});
		const data = await res.json();
		return (data.message);
	} catch (err) {
		return ('Error: ' + err);
	}
}

export async function createTournament(name: string): Promise<any | null> {
	console.log('[Public: createTournament] createTournament called with name:', name);
	try {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
	  	}
		const res = await fetch('/gate/game/tournament/createTournament', {
			method: 'POST',
			credentials: 'include',
			headers: headers,
			body: JSON.stringify({ name })
		});
		if (!res.ok) {
			console.log('[Public: createTournament] Tournament creation failed, status: ', res.status);
			return (null);
		}
		const data = await res.json();
		console.log('[Public: createTournament] Tournament creation response received:', data);
		return (data);
	} catch (err) {
		return ('Error: ' + err);
	}
}

export async function lockAndStartTournament(name: string){
	try {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
	  	}
		const response = await fetch('/gate/game/tournament/startTournament', {
			method: 'POST',
			headers: headers,
			body: JSON.stringify({ name })
		});
		const result = await response.json();
		if (!result.ok)
				return;
		return;
	} catch (err) {
		return;
	}
}


