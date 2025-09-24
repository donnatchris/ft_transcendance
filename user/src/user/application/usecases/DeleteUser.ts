import { IUserRepository } from "../../domain/IUserRepository.js";
import { IAvatarRepository } from "../../domain/IAvatarRepository.js";
import { UserId } from '../../domain/value-object/UserId.js';

export type DeleteUserParamsType = {
	id_user: string;
	plainPassword: string;
}

export interface IPasswordComparator {
	verify(plainPassword: unknown, hashedKey: string): Promise<boolean>;
}

export class DeleteUser {

	private readonly userRepo: IUserRepository;
	private readonly avatarRepo: IAvatarRepository;
	private readonly comparator: IPasswordComparator;

	constructor(userRepo: IUserRepository, comparator: IPasswordComparator, avatarRepo: IAvatarRepository) {
		this.userRepo = userRepo;
		this.avatarRepo = avatarRepo;
		this.comparator = comparator;
	}
	async execute(p: DeleteUserParamsType): Promise<void> {
		const id = p.id_user;
		const plainPassword = p.plainPassword;
		if (!id || !plainPassword) {
			throw new Error("id and password are required.");
		}
		const userId: UserId = UserId.create(id);
		const user = await this.userRepo.findById(userId);
		if (!user) {
			throw new Error("User not found.");
		}
		const isPasswordValid = await this.comparator.verify(plainPassword, user.passwordHash.value);
		if (!isPasswordValid) {
			throw new Error("Invalid password.");
		}
		await this.userRepo.delete(userId);
		await this.avatarRepo.deleteAllForUser(userId.value);

	}
}
