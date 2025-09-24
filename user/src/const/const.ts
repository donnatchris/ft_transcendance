
export const cookieOptions = {
	path: '/',
	httpOnly: false,
	secure: true,
	sameSite: 'strict' as const,
	maxAge: 60 * 60 * 1000
};

export type UserStatus = 'online' | 'offline' | 'in-game';