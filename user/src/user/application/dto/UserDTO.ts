// Output with public data to send to the front-end
export type UserPublicDTO = {
	id_user: number;
	display_name: string;
	avatar: string | null;
	status: string;
};

export type UserPublicListDTO = {
	users: UserPublicDTO[];
};

// Output with private data to send to the front-end when the user is logged in
export type UserMeDTO = UserPublicDTO & {
	login: string;
	email: string;
	win: number;
	loose: number;
};

// Input to receive from the front-end
export type RegisterUserDTO = {
	login: string;
	display_name: string;
	email: string;
	plainPassword: string;
};

// Input to receive from the front-end when updating user data
export type PatchUserDTO = {
	id_user: number;
	password: string;
	field: 'password' | 'login' | 'display_name' | 'email';
	value: string;
};
