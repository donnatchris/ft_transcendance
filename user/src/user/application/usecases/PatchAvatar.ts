import { MultipartFile } from '@fastify/multipart';
import { UserId } from '../../domain/value-object/UserId.js';
import { IUserRepository } from '../../domain/IUserRepository.js';
import { IAvatarRepository } from '../../domain/IAvatarRepository.js';


export class PatchAvatar {
	
	private readonly userRepo: IUserRepository;
	private readonly fileRepo: IAvatarRepository;

	constructor(userRepo: IUserRepository, fileRepo: IAvatarRepository) {
		this.userRepo = userRepo;
		this.fileRepo = fileRepo;
	}

	async execute(id: UserId, file: MultipartFile): Promise<string> {
		const userId = id.value;

		const newPath = await this.fileRepo.uploadData(userId, file);
		await this.userRepo.updateProfile(id, { field: 'avatar', value: newPath });
		return newPath;
	}
}
