import jwt from 'jsonwebtoken';
import { FastifyRequest } from 'fastify';
import { dbGet } from '../utils/dbUtils.js';


// const and types
if (!process.env.JWT_SECRET_KEY) {
	console.warn("Warning: JWT_SECRET_KEY is not defined in environment variables.");
	throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
}
const SECRET_KEY: jwt.Secret = process.env.JWT_SECRET_KEY ?? 'dev_secret';
const EXPIRATION_TIME = "3h";
export type UserTokenPayloadType = {
	id_user: number;
	login: string;
	display_name: string;
	avatar: string;
	status: string;
};


export async function createJwtFromId(id: number): Promise<string> {
	const query =	`SELECT login, display_name, avatar, status
					FROM users
					WHERE id_user = ?`;
	try {
		const row = await dbGet(query, [id]);
		if (!row) {
			return '';
		}
		const token = jwt.sign(row, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
		return token;
	}
	catch {
		return '';
	}
}


// Function to create a JWT token
// It takes the user ID, login, and display name as payload
// It uses the secret key and expiration time defined above
// Returns the generated token
export function createJWT(id_user: number, login: string, display_name: string, avatar: string, status: string): string {
	const token = jwt.sign(
		{ id_user, login, display_name, avatar, status },
		SECRET_KEY,
		{ expiresIn: EXPIRATION_TIME }
	);
	return token;
}


// Function to get the JWT payload from the request
// It checks the Authorization header for a Bearer token
// If the token is valid, it returns the payload, otherwise returns null
export function getTokenPayload(request: FastifyRequest): UserTokenPayloadType | null {
	let token = request.cookies?.token;
	if (!token) {
		const authHeader = request.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return null;
		}
		token = authHeader.slice(7);
	}
	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		if (typeof decoded === 'string') {
			console.error("[User: jwt] token payload is a string, expected an object.");
			return null;
		}
		if (!isUserTokenPayload(decoded)) {
			console.error("[User: jwt] invalid token payload structure.");
			return null;
		}
		return decoded as UserTokenPayloadType;
	}
	catch  (err) {
		return null;
	}
}

function isUserTokenPayload(payload: any): payload is UserTokenPayloadType {
  return (
    typeof payload?.id_user === "number" &&
    typeof payload?.login === "string" &&
    typeof payload?.display_name === "string" &&
    typeof payload?.avatar === "string" &&
    typeof payload?.status === "string"
  );
}
