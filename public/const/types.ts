export type LoginDataObject = {
  identifier: string,
  plainPassword: string
};

export type RegisterDataObject = {
  login: string,
  email: string,
  plainPassword: string,
  display_name: string,
  avatar: string
};

export type UserData = {
	login: string,
	email: string,
	display_name: string,
	win: number,
	loss: number
}