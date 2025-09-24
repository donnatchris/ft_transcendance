import { REGEX, ERROR } from '../../../const/const.js';
import { LoginDataObject } from '../../../const/types.js';
import { showError, showSuccess, showErrorInDiv, showSuccessInDiv } from '../../../utils/show.js';
import { getUser, getFriends, getAllUsers, getInvitations, getRequests } from '../../../utils/getters.js'
import { postFriend, sendAnswerPendingFriends} from '../../../utils/posters.js';
import { renderRequestRows, renderRows } from '../../../utils/render.js';

async function handleAnswerAndRefresh(row: HTMLTableRowElement, requestId: string | number, answer: string): Promise<void> {
    await sendAnswerPendingFriends(row, requestId, answer);

    const friendsList = document.getElementById('friends_list_to_insert') as HTMLElement;
    const pendingInvitationsList = document.getElementById('pending_invitations_to_insert') as HTMLElement;
    const pendingRequestsList = document.getElementById('pending_requests_to_insert') as HTMLElement;

    const [friends, invitations, requests] = await Promise.all([
        getFriends(),
        getInvitations(),
        getRequests()
    ]);

    renderRows(requests, pendingRequestsList);
    renderRows(friends, friendsList, true);
    renderRequestRows(invitations, pendingInvitationsList, handleAnswerAndRefresh);
}

export async function addFriendsEvents() {
	let user = await getUser();
	const friendsOk = document.getElementById('friends-ok');
	const friendsKo = document.getElementById('friends-ko');
	if (!user) {
		if (friendsOk && friendsKo) {
			friendsKo.classList.remove('hidden');
		}
	} else {
		if (friendsOk && friendsKo) {
			friendsOk.classList.remove('hidden');

			const friends = await getFriends();
			const allUsers = await getAllUsers();
			const invitations = await getInvitations();
			const requests = await getRequests();

			const friendsList = document.getElementById('friends_list_to_insert')!;
			const pendingInvitationsList = document.getElementById('pending_invitations_to_insert')!;
			const pendingRequestsList = document.getElementById('pending_requests_to_insert')!;

			renderRows(requests, pendingRequestsList);
			renderRows(invitations, pendingInvitationsList);
			renderRows(friends, friendsList, true);
			renderRequestRows(invitations, pendingInvitationsList, sendAnswerPendingFriends);

			const addFriendForm = document.getElementById('addFriendForm') as HTMLFormElement | null;
			const results = document.getElementById('results') as HTMLDivElement;
			if (addFriendForm) {
				addFriendForm.addEventListener('submit', async (event) => {
					event.preventDefault();
					const input = document.getElementById('addFriendInput') as HTMLInputElement | null;
					if (input) {
						const display_name = input.value.trim();
						if (display_name.length > 0) {
							try {
								const user = allUsers.find((u: any) => u.display_name === display_name);
        						if (!user) {
            						showErrorInDiv("Error: " + display_name + " does not exist", results);
									return;
       							}
        						const userId: number = user.id_user;
								console.log('user ID: ', userId);
								const res = await postFriend(userId);
								showSuccessInDiv(res as string, results);
								input.value = "";
								// reactualisation de la liste d amis
								const updatedFriends = await getFriends();
								renderRows(updatedFriends, friendsList, true);
								// reactualisation de la liste d invitations
								const updatedInvitations = await getInvitations();
								renderRequestRows(updatedInvitations, pendingInvitationsList, handleAnswerAndRefresh);
								// reactualisation de la liste de requetes
								const updatedRequests = await getRequests();
								renderRows(updatedRequests, pendingRequestsList);
							} catch (err) {
								showErrorInDiv(err as string, results);
							}
						} else {
							showErrorInDiv("Error: empty", results);
						}
					}
				});
			}
		}
	}
}
