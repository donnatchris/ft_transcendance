import { FastifyRequest, FastifyReply } from 'fastify';
import { GetAllUsers } from '../../../../application/usecases/GetAllUsers.js';
import { SqliteUserRepository } from '../../../../infrastructure/sqlite/SqliteUserRepository.js';


export default async function allUsers(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	console.log("[User: allUsers] allUsers handler called.");
	const useCase = new GetAllUsers(new SqliteUserRepository());
	let userArray = await useCase.execute();
	return reply.status(200).send({
		success: true,
		message: "All users successfully fetched.",
		users: userArray
	});
}

// import { FastifyRequest, FastifyReply } from 'fastify';
// import { getTokenPayload } from '../../../../utils/jwt.js';
// import { dbAll } from '../../../../utils/dbUtils.js';


// export default async function allUsers(request: FastifyRequest, reply: FastifyReply): Promise<void> {
// 	console.log("[All users] All Users handler called.");
// 	try {
// 		const query =	`SELECT id_user, display_name, avatar, status
// 						FROM users
// 						ORDER BY display_name COLLATE NOCASE ASC`;
// 		const usersArray = await dbAll(query, []);
// 		console.log("[All users] All users successfully fetched.");
// 		return reply.status(200).send({
// 			success: true,
// 			message: "All users successfully fetched.",
// 			users: usersArray
// 		});
// 	}
// 	catch (error) {
//         console.log("[All users] dbAll error: ", error);
//         return reply.status(500).send({
//             success: false,
//             message: "Failed to fetch users: internal error."
//         });
// 	}
// }
