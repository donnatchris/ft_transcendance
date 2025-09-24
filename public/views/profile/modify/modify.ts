import { REGEX, ERROR } from '../../../const/const.js';
import { LoginDataObject } from '../../../const/types.js';
import { showError, showSuccess, showErrorInDiv, showSuccessInDiv } from '../../../utils/show.js';
import { getUser } from '../../../utils/getters.js'

export async function addModifyProfileEvents() {
	const user = await getUser();
	const playOk = document.getElementById('play-ok');
	const playKo = document.getElementById('play-ko');
	if (!user) {
		if (playOk && playKo)
		{
			playKo.classList.remove('hidden');
		}
	} else {
		if (playOk && playKo)
		{
			playOk.classList.remove('hidden');
		}
	}
}