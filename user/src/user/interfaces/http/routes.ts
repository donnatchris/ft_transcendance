import { FastifyInstance } from 'fastify';
import * as handlers from './handlers/index.js';
import * as preHandlers from './preHandlers/index.js';


export async function registerRoutes(app: FastifyInstance): Promise<void> {
	console.log("[User: routes] Registering user routes...");
	app.post('/find_user_by_id', handlers.findUserById);
	app.get('/all_users', handlers.allUsers);
	app.get('/nb_online', handlers.onlineUsers)
	app.get('/privacy_policy', handlers.privacyPolicy);
	app.get('/avatar_get',  handlers.avatar);
	app.post('/update_player_score', handlers.updatePlayerScore);
	app.get('/heartbeat', {
		preHandler: preHandlers.authenticate,
		handler: handlers.heartbeatListener
	});
	app.post('/register', {
		preHandler: preHandlers.nonAuthenticate,
		handler: handlers.register
	});
	app.post('/login', {
		preHandler: preHandlers.nonAuthenticate,
		handler: handlers.login
	});
	app.get('/logout', {
		preHandler: preHandlers.authenticate,
		handler: handlers.logout
	});
	app.get('/me', {
		preHandler: preHandlers.authenticate,
		handler: handlers.me
	});
	app.get('/profile', {
		preHandler: preHandlers.authenticate,
		handler: handlers.profile
	});
	app.delete('/delete_me', {
		preHandler: preHandlers.authenticate,
		handler: handlers.deleteMe
	});
	app.patch('/patch_user', {
		preHandler: preHandlers.authenticate,
		handler: handlers.patchUser
	})
	app.patch('/change_user_field', {
		preHandler: preHandlers.authenticate,
		handler: handlers.patchUser
	})
	app.get('/friends', {
		preHandler: preHandlers.authenticate,
		handler: handlers.friends
	});
	app.get('/friends_pending_invitations', {
		preHandler: preHandlers.authenticate,
		handler: handlers.friendsPendingInvitations
	});
	app.get('/friends_pending_requests', {
		preHandler: preHandlers.authenticate,
		handler: handlers.friendsPendingRequests
	});
	app.post('/avatar_upload', {
		preHandler: preHandlers.authenticate,
		handler: handlers.avatarUpload
	});
	app.post('/friend_request', {
		preHandler: preHandlers.authenticate,
		handler: handlers.friendRequest
	});
	app.patch('/friend_answer', {
		preHandler: preHandlers.authenticate,
		handler: handlers.friendAnswer
	});
	app.delete('/remove_friend', {
		preHandler: preHandlers.authenticate,
		handler: handlers.removeFriend
	});
}