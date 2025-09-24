import { User } from "../../domain/User.js";
import { UserPublicDTO, UserMeDTO, UserPublicListDTO } from "./UserDTO.js";
import { FriendListItemDTO, FriendListDTO, } from "./FriendListDTO.js";


export class UserMapper {

	static toPublicDTO(u: User): UserPublicDTO {
		return {
			id_user: u.id.value,
			display_name: u.display_name.value,
			avatar: u.avatar?.value ?? null,
			status: u.status.value,
		};
	}

	static toMeDTO(u: User): UserMeDTO {
		return {
			...this.toPublicDTO(u),
			login: u.login.value,
			email: u.email.value,
			win: u.win.value,
			loose: u.loose.value
		};
	}

	static toFriendListItemDTO(u: User): FriendListItemDTO {
		return {
			id_user: u.id.value,
			display_name: u.display_name.value,
			avatar: u.avatar?.value ?? null,
			status: u.status.value,
			win: u.win.value,
			loose: u.loose.value
		};
	}

	static toFriendListDTO(users: User[]): FriendListDTO {
		return users.map(u => this.toFriendListItemDTO(u));
	}

}
