import { IUserRepository } from "../../domain/IUserRepository.js";
import { UserId } from '../../domain/value-object/UserId.js';
import { UserMapper } from "../dto/UserMapper.js";
import { UserPublicDTO } from "../dto/UserDTO.js";


export class FindUserById {
	private readonly userRepo: IUserRepository;

	constructor(userRepo: IUserRepository) {
		this.userRepo = userRepo;
	}
	
	async execute(id: number): Promise<UserPublicDTO | null> {
		const userId = UserId.create(id);
		const user = await this.userRepo.findById(userId);
		if (!user) {
			return null;
		}
		return UserMapper.toPublicDTO(user);
	}
}
