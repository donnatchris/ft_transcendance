import { FastifyRequest, FastifyReply } from 'fastify';
import { createJWT } from '../../../../utils/jwt.js';
import { cookieOptions } from '../../../../../const/const.js';
import { SqliteUserRepository } from '../../../../infrastructure/sqlite/SqliteUserRepository.js';
import { PatchAvatar } from '../../../../application/usecases/PatchAvatar.js';
import { AvatarFsRepository } from '../../../../infrastructure/storage/AvatarFSRepository.js';
import { UserId } from '../../../../domain/value-object/UserId.js';


export default async function avatarUpload(request: FastifyRequest, reply: FastifyReply) {
	console.log("[User avatar_upload] Avatar Upload called");
	if (!request.user) {
		return reply.status(401).send({
			success: false,
			message: "Unauthorized."
		});
	}
	const data = await request.file();
	if (!data) {
		return reply.status(400).send({
			success: false,
			message: "File is required."
		});
	}
	const useCase = new PatchAvatar(new SqliteUserRepository(), new AvatarFsRepository());
	const id = UserId.create(request.user.id_user);
	const newAvatarPath = await useCase.execute(id, data);
	const newToken = createJWT(request.user.id_user, request.user.login, request.user.display_name, newAvatarPath, request.user.status);
	console.log("[User avatar_upload] Avatar successfully uploaded.");
	return reply
		.setCookie('token', newToken, cookieOptions)
		.status(200)
		.send({
			success: true,
			message: "Avatar was successfully uploaded.",
			token: newToken
		});
}


// export default async function avatarUpload(request: FastifyRequest, reply: FastifyReply) {
// 	console.log("[User avatar_upload] Avatar Upload called");
// 	const token = getTokenPayload(request);
//     if (!token) {
//         console.log("[User avatar_upload] User is not authentificated.");
//         return reply.status(401).send({
//             success: false,
//             message: "You must be logged in to load your avatar image."
//         });
//     }
// 	const data = await request.file();
// 	if (!data || (data && data.mimetype !== 'image/jpeg' && data.mimetype !== 'image/png' && data.mimetype !== 'image/webp')) {
// 		console.log("[User avatar_upload] Invalid file format.");
// 		return reply.status(400).send({
// 			success: false,
// 			message: "Invalid file format (only png / jpeg / webp are accepted)."
// 		});
// 	}
// 	const ext = '.' + (extension(data.mimetype) || 'bin');
// 	const savePathTmp = `images/${token.id_user}.tmp` + ext;
// 	const savePath = `images/${token.id_user}` + ext;
// 	try {
// 		const pump = promisify(pipeline);
// 		await pump(data.file, createWriteStream(savePathTmp));
// 		await fs.rename(savePathTmp, savePath);
// 		const oldAvatarFile = await getAvatar(token.id_user);
// 		await updateAvatarPathInDb(token.id_user, savePath);
// 		if (oldAvatarFile !== savePath && oldAvatarFile !== 'images/default.png') {
// 			await deleteFile(oldAvatarFile);
// 		}
// 		console.log(`[User avatar_upload] Avatar file ${savePath} successfully uploaded and renamed.`);
// 		const newToken = createJWT(token.id_user, token.login, token.display_name, savePath, token.status);
// 		return reply
// 			.setCookie('token', newToken, cookieOptions)
// 			.status(200)
// 			.send({
// 				success: true,
// 				message: "Avatar was successfully uploaded.",
// 		});
// 	}
// 	catch (error: any) {
// 		await deleteFile(savePathTmp);
// 		let code = 400;
// 		let message = "Unable to upload avatar: internal error.";
// 		if (error.code === 'FST_MULTIPART_FILE_TOO_LARGE') {
// 			code = 400;
// 			message = "Unable to upload avatar: file too large (max 2 Mo).";
// 		}
// 		return reply.status(code).send({
// 			success: false,
// 			message: message
// 		});
// 	}
// }


// async function getAvatar(id: number): Promise<string | null> {
// 	const query = `SELECT avatar FROM users WHERE id_user = ?`;
// 	try {
// 		const row = await dbGet(query, [id]);
// 		if (row?.avatar) {
// 			console.log(`[User avatar_upload] Avatar found in database.`);
// 			return row.avatar;
// 		}
// 		else {
// 			console.log(`[User avatar_upload] No avatar found in database.`);
// 			return null;
// 		}
// 	}
// 	catch (error) {
// 		console.log(`[User avatar_upload] DbGet error: `, error);
// 		return null;
// 	}
// }


// async function deleteFile(filepath: string | null) {
// 	try {
// 		if (filepath) {
// 			await fs.unlink(filepath);
// 			console.log(`[User avatar_upload] File removed.`);
// 		}
// 		else {
// 			console.log(`[User avatar_upload] Filepath is empty.`);
// 		}
// 	}
// 	catch (error) {
// 		console.log(`[User avatar_upload] No file to remove, or no permission on file.`);
// 	}
// }


// async function updateAvatarPathInDb(id: number, filepath: string) {
// 	try {
// 		const query =	`UPDATE users
// 						SET avatar = ?
// 						WHERE id_user = ?`
// 		await dbRun(query, [filepath, id]);
// 		console.log(`[User avatar_upload] Avatar successfully updated in database.`);
// 	} catch (error) {
// 		console.log(`[User avatar_upload] Failed to update avatar in database.`);
// 		throw error;
// 	}
// }

