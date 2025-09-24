import { Home } from './views/home/home_view.js';
import { Login } from './views/login/login_view.js';
import { Register } from './views/register/register_view.js';
import { Credit } from './views/credit/credit_view.js';
import { ModifyAvatar } from './views/profile/avatar/avatar_view.js';
import { Dashboard } from './views/profile/dashboard/dashboard_view.js';
import { Stats } from './views/profile/stats/stats_view.js';
import { Friends } from './views/profile/friends/friends_view.js';
import { Play } from './views/play/play_view.js';
import { PlayOnline} from './views/play/playonline/playonline_view.js';
import { PlayVsIA } from './views/play/playvsia/playvsia_view.js';
import { PlayLocal } from './views/play/playlocal/playlocal_view.js';
import { Tournament } from './views/play/tournament/tournament_view.js';
import { Policy } from './views/policy/policy_view.js';

import { addLoginBoxEvents } from './loginBox.js';
import { addHomeEvents } from './views/home/home.js';
import { addLoginEvents } from './views/login/login.js';
import { addRegisterEvents } from './views/register/register.js';
import { addModifyAvatarEvents} from './views/profile/avatar/avatar.js';
import { addDashboardEvents} from './views/profile/dashboard/dashboard.js';
import { addFriendsEvents} from './views/profile/friends/friends.js';
import { addStatsEvents} from './views/profile/stats/stats.js';
import { addPlayOnlineEvents } from './views/play/playonline/playonline.js';
import { addPlayVsIAEvents } from './views/play/playvsia/playvsia.js';
import { addPlayLocalEvents } from './views/play/playlocal/playlocal.js';
import { addTournamentEvents } from './views/play/tournament/tournament.js';
import { addPolicyEvents } from './views/policy/policy.js';
import { tournamentCleanup } from './views/play/tournament/tournament.js';

type ViewFunction = () => string;

const routes: Record<string, ViewFunction> = {
  '': Home,
  'login': Login,
  'register': Register,
  'policy': Policy,
  'play': Play,
  'play/online': PlayOnline,
  'play/ia': PlayVsIA,
  'play/local': PlayLocal,
  'play/tournament': Tournament,
  'credit': Credit,
  'profile/dashboard': Dashboard,
  'profile/stats': Stats,
  'profile/friends': Friends,
  'profile/avatar': ModifyAvatar
};

const router = (): void => {
  const path = location.hash.slice(1) || '';
  const view: ViewFunction = routes[path] || (() => `<h1>Page introuvable</h1>`);

  const screenElement = document.getElementById('screen');
  if (screenElement) {
	if (path != 'play/tournament'){
		tournamentCleanup();
	}
    screenElement.innerHTML = view();
    addLoginBoxEvents();

    switch (path) {
		case 'login':
			addLoginEvents();
			break;

		case 'register':
			addRegisterEvents();
			break;

		case 'policy':
			addPolicyEvents();
			break;
		
		case 'play/online':
			addPlayOnlineEvents();
			break;
		
		case 'play/ia':
			addPlayVsIAEvents();
			break;
		
		case 'play/local':
			addPlayLocalEvents();
			break;
		
		case 'play/tournament':
			addTournamentEvents();
			break;
		
		case 'profile/dashboard':
			addDashboardEvents();
			break;
		
		case 'profile/stats':
			addStatsEvents();
			break;
		
		case 'profile/friends':
			addFriendsEvents();
			break;
		
		case 'profile/avatar':
			addModifyAvatarEvents();
			break;
		
		case '':
			addHomeEvents();
			break;
		
		default:
			// Optionnel : pour les routes non gérées
			console.log('Route non gérée:', path);
			break;
    }

  } else {
    console.error('Élément #screen introuvable dans le DOM.');
  }
};

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);

