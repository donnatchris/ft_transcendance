import bcrypt from 'bcryptjs';




// Function to hash a password
// Takes a clear text password and returns a hashed version
// Must be called in a try-catch block to handle errors
export async function hashPassword(clearPass: string): Promise<string> {
	console.log("[User bcrypt] Hashing password.");
	const salt = await bcrypt.genSalt(10);
	const hashedPass = await bcrypt.hash(clearPass, salt);
	return hashedPass;
}


// Function to compare a clear text password with a hashed password
// Returns true if they match, false otherwise
export async function isCorrectPassword(clearPassword: string, hashedKey: string): Promise<boolean> {
	console.log("[User bcrypt] Comparing hashed passwords.");
	try {
		return await bcrypt.compare(clearPassword, hashedKey);
	}
	catch (err) {
		console.log("[User bcrypt] Bcrypt compare failed.");
		return false;
	}
}


