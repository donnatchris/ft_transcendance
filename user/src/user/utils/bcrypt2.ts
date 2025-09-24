import bcrypt from 'bcryptjs';
import { IPasswordHasher } from '../domain/User';
import { IPasswordComparator } from '../../user/application/usecases/LoginUser.js';


export class BcryptPasswordManager implements IPasswordHasher, IPasswordComparator {

	async hash(clearPass: string): Promise<string> {
		console.log("[User bcrypt] Hashing password.");
		const salt = await bcrypt.genSalt(10);
		const hashedPass = await bcrypt.hash(clearPass, salt);
		return hashedPass;
	}

	async verify(plainPassword: string, hashedKey: string): Promise<boolean> {
	console.log("[User bcrypt] Comparing hashed passwords.");
		try {
			return await bcrypt.compare(plainPassword, hashedKey);
		}
		catch (err) {
			console.log("[User bcrypt] Bcrypt compare failed.");
			return false;
		}
	}

}