import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import multipart from '@fastify/multipart';
import fastifyCors from '@fastify/cors';
import cookie from '@fastify/cookie';
import fs from 'fs';
import db from './database.js';
import { UserLifecycleDaemon } from './user/utils/UserLifecycleDaemon.js';
import { registerRoutes } from './user/interfaces/http/routes.js';


const options = {
  key: fs.readFileSync('/etc/ssl/selfsigned.key'),
  cert: fs.readFileSync('/etc/ssl/selfsigned.crt'),
};

const app = Fastify({
  logger: true,
  https: options,
});

await app.register(fastifyCors, {
  origin: true,
  credentials: true,
});

await app.register(cookie, { parseOptions: {}});

await app.register(multipart, {
	limits: {
		fieldNameSize: 100, // Max field name size in bytes
		fieldSize: 1024 * 16,     // Max field value size in bytes
		fields: 10,         // Max number of non-file fields
		fileSize: 2 * 1024 * 1024,  // For multipart forms, the max file size in bytes
		files: 1,           // Max number of file fields
		headerPairs: 200,  // Max number of header key=>value pairs
		parts: 10 
	},
	throwFileSizeLimit: true  // will throw: Error: Multipart: file too large (error.code === 'FST_MULTIPART_FILE_TOO_LARGE')
});

// Register routes
await registerRoutes(app);

// Daemon for user lifecycle management
// This will set users to offline after a delay, and purge old accounts
const daemon = new UserLifecycleDaemon();
daemon.start();
process.on('SIGINT',  () => { daemon.stop(); process.exit(0); });
process.on('SIGTERM', () => { daemon.stop(); process.exit(0); });




// Https Routes
// app.get('/privacy_policy', handlers.privacyPolicy);
// app.get('/me', handlers.me);
// app.get('/heartbeat', handlers.heartbeatListener);
// app.get('/logout', handlers.logout);
// app.get('/profile', handlers.profile);
// app.get('/friends', handlers.friends);
// app.get('/friends_pending_invitations', handlers.friendsPendingInvitations);
// app.get('/friends_pending_requests', handlers.friendsPendingRequests);
// app.get('/all_users', handlers.allUsers);
// app.get('/non_friend_userss', handlers.nonFriendUsers);
// app.get('/online', handlers.online);
// app.get('/avatar_get', handlers.avatar);
// app.post('/register', handlers.register);
// app.post('/login', handlers.login);
// app.post('/change_status', handlers.changeStatus);
// app.post('/update_player_score', handlers.updatePlayerScore);
// app.post('/avatar_upload', handlers.avatarUpload);
// app.post('/friend_request', handlers.friendRequest);
// app.patch('/change_user_field', handlers.changeUserField);
// app.patch('/friend_answer', handlers.friendAnswer);
// app.delete('/delete_me', handlers.deleteMe);
// app.delete('/remove_friend', handlers.removeFriend);


// Start the server
app.listen({ port: 3001, host: '0.0.0.0' }).then(() => {
  console.log('Server listening on port 3001');
}).catch(err => {
  app.log.error(err);
  process.exit(1);
});


// // database content see MCD 
// interface AddUserBody {
//   login: string;
//   email: string;
//   password: string;
//   display_name: string;
//   avatar?: string;
//   status?: string;
//   win?: number;
//   loose?: number;
// };



// // POST REQUEST
// app.post('/addUser', async (request: FastifyRequest<{ Body: AddUserBody }>, reply: FastifyReply) => {
//   const { login, email, password, display_name, avatar = '', status = 'offline', win = 0, loose=0} = request.body;
//   return new Promise((resolve, reject) => {
//     db.run(
//       `INSERT INTO users (login, email, password, display_name, avatar, status, win, loose)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//       [login, email, password, display_name, avatar, status],
//       function (err) {
//         if (err) {
//           reply.status(500).send("Error during add user");
//           return reject(err);
//         }
//         reply.send({ message: 'Added user : ', userId: this.lastID });
//         resolve(null);
//       }
//     );
//   });
// });





// GET REQUEST
app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM users', [], (err: Error | null, rows: any[]) => {
      if (err) {
        reply.status(500).send('Error during get all users');
        return reject(err);
      }
      reply.send(rows);
      resolve(null);
    });
  });
});

app.get('/health', async (request : FastifyRequest, reply: FastifyReply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// app.get('/sort/win', async (request: FastifyRequest, reply: FastifyReply) => {
//   return new Promise((resolve, reject) => {
//     db.all('SELECT * FROM users ORDER BY win DESC', [], (err: Error | null, rows: any[]) => {
//       if (err) {
//         reply.status(500).send('Error during get all users');
//         return reject(err);
//       }
//       reply.send(rows);
//       resolve(null);
//     });
//   });
// });

// app.get('/id/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
//   const userId = request.params.id;

//   return new Promise((resolve, reject) => {
//     db.get('SELECT * FROM users WHERE id_user = ?', [userId], (err: Error | null, row: any) => {
//       if (err) {
//         reply.status(500).send('Error during get user by id');
//         return reject(err);
//       }
//       if (!row) {
//         reply.status(404).send('User not found');
//         return resolve(null);
//       }
//       reply.send(row);
//       resolve(null);
//     });
//   });
// });

// app.get('/login/:login', async (request: FastifyRequest<{ Params: { login: string } }>, reply: FastifyReply) => {
//   const { login } = request.params;
//   return new Promise((resolve, reject) => {
//       db.get('SELECT * FROM users WHERE login = ?', [login], (err: Error | null, row: any) => {
//         if (err) {
//           reply.status(500).send('Error during get user by login');
//           return reject(err);
//         }
//         if (!row) {
//           reply.status(404).send('User not found');
//           return resolve(null);
//         }
//         reply.send(row);
//         resolve(null);
//       });
//     });
// });

// app.get('/display/:display', async (request: FastifyRequest<{ Params: { display: string } }>, reply: FastifyReply) => {
//   const { display } = request.params;
//   return new Promise((resolve, reject) => {
//       db.get('SELECT * FROM users WHERE display_name = ?', [display], (err: Error | null, row: any) => {
//         if (err) {
//           reply.status(500).send('Error during get user by display_name');
//           return reject(err);
//         }
//         if (!row) {
//           reply.status(404).send('User not found');
//           return resolve(null);
//         }
//         reply.send(row);
//         resolve(null);
//     });
//   });
// });

// app.get('/online/:status', async (request: FastifyRequest<{ Params: { status: string } }>, reply: FastifyReply) => {
//   const { status } = request.params;
//   return new Promise((resolve, reject) => {
//     db.all('SELECT * FROM users WHERE status = ?', [status], (err: Error | null, rows: any[]) => {
//       if (err) {
//         reply.status(500).send('Error during get online users');
//         return reject(err);
//       }
//       reply.send(rows);
//       resolve(null);
//     });
//   });
// });

// // PUT

// app.put('/change_display', async (request: FastifyRequest<{ Body: { id_user: number, newDisplay: string } }>, reply: FastifyReply) => {
//   const { id_user, newDisplay } = request.body;
//   return new Promise((resolve, reject) => {
//     db.run(
//       'UPDATE users SET display_name = ? WHERE id_user = ?',
//       [newDisplay, id_user],
//       function (err) {
//         if (err) {
//           reply.status(500).send('error during display_name update');
//           return reject(err);
//         }
//         if (this.changes === 0) {
//           reply.status(404).send('user not found');
//           return resolve(null);
//         }
//         reply.send({ message: 'Display name updated' });
//         resolve(null);
//       }
//     );
//   });
// });

// app.put('/increment_win', async (request: FastifyRequest<{ Body: { id_user: number } }>, reply: FastifyReply) => {
//   const { id_user } = request.body;
//   return new Promise((resolve, reject) => {
//     db.run(
//       'UPDATE users SET wins = wins + 1 WHERE id_user = ?',
//       [id_user],
//       function (err) {
//         if (err) {
//           reply.status(500).send('error during increment_win');
//           return reject(err);
//         }
//         if (this.changes === 0) {
//           reply.status(404).send('user not found');
//           return resolve(null);
//         }
//         reply.send({ message: 'Win incremented' });
//         resolve(null);
//       }
//     );
//   });
// });

// app.put('/increment_loose', async (request: FastifyRequest<{ Body: { id_user: number } }>, reply: FastifyReply) => {
//   const { id_user } = request.body;
//   return new Promise((resolve, reject) => {
//     db.run(
//       'UPDATE users SET loose = loose + 1 WHERE id_user = ?',
//       [id_user],
//       function (err) {
//         if (err) {
//           reply.status(500).send('error during increment_loose');
//           return reject(err);
//         }
//         if (this.changes === 0) {
//           reply.status(404).send('user not found');
//           return resolve(null);
//         }
//         reply.send({ message: 'Loose incremented' });
//         resolve(null);
//       }
//     );
//   });
// });


// // DELETE

// app.delete('/:id', async (request: FastifyRequest<{ Params: { id : string } }>, reply: FastifyReply) => {
//   const { id } = request.params;
//   return new Promise((resolve, reject) => {
//     db.run(
//       'DELETE FROM users WHERE id_user = ?',
//       [id],
//       function (err) {
//         if (err) {
//           reply.status(500).send('Error during users delete');
//           return reject(err);
//         }
//         if (this.changes === 0) {
//           reply.status(404).send('User not found');
//           return resolve(null);
//         }
//         reply.send({ message: 'Deleted user' });
//         resolve(null);
//       }
//     );
//   });
// });



