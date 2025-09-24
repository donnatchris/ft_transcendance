import { MultipartFile } from '@fastify/multipart';


export interface IAvatarRepository {
  uploadData(userId: number, data: MultipartFile): Promise<string>;
  deleteFile(key: string | null): Promise<void>;
  deleteAllForUser(userId: number): Promise<void>;
}
