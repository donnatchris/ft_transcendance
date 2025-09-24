import { REGEX, ERROR } from '../../../const/const.js';
import { LoginDataObject } from '../../../const/types.js';
import { showError, showSuccess, showErrorInDiv, showSuccessInDiv } from '../../../utils/show.js';
import { getUser } from '../../../utils/getters.js';

export async function addModifyAvatarEvents() {
    const user = await getUser();
    const avatarOk = document.getElementById('avatar-ok');
    const avatarKo = document.getElementById('avatar-ko');

    if (!user) {
        if (avatarOk && avatarKo) {
            avatarKo.classList.remove('hidden');
        }
    } else {
        if (avatarOk && avatarKo) {
            avatarOk.classList.remove('hidden');
            
            const form = document.getElementById('avatarForm') as HTMLFormElement | null;
            if (form) {
                form.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const formData = new FormData(form);

                    fetch(form.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token') // ou ton token en dur pour test
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.token) {
                            localStorage.setItem('token', data.token);
                        }
						window.location.hash = "#profile/dashboard";
                    })
                    .catch(err => console.error(err));
                });
            }
        }
    }
}