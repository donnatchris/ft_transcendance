import { createWriteStream } from "node:fs";
import { promises as fs } from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import path from "node:path";
import { extension as extFromMime } from "mime-types";
import type { MultipartFile } from "@fastify/multipart";
import { IAvatarRepository } from "../../domain/IAvatarRepository.js";


export class AvatarFsRepository implements IAvatarRepository {

	private readonly dir: string;
	private readonly allowedMimeTypes: ReadonlySet<string>;

	constructor(dir: string = 'images', allowedMimeTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']) {
		this.dir = dir;
		this.allowedMimeTypes = new Set(allowedMimeTypes);
	}

	private async ensureDirExists() {
		await fs.mkdir(this.dir, { recursive: true });
	}


	async uploadData(id: number, data: MultipartFile): Promise<string> {
		if (!data) {
			throw new Error("No file provided.");
		}
		if (!this.allowedMimeTypes.has(data.mimetype)) {
			throw new Error("Invalid file type. Only JPEG, PNG, and WEBP are allowed.");
		}
		await this.ensureDirExists();
		const ext = (extFromMime(data.mimetype) as string || 'bin');
		const base = `${id}.${ext}`;
		const finalPath = path.join(this.dir, base);
		const tmpPath = finalPath + '.tmp';
		const pump = promisify(pipeline);
		try {
			await pump(data.file, createWriteStream(tmpPath));
			await fs.rename(tmpPath, finalPath);
			return `${this.dir}/${base}`;
		} catch (error) {
			await this.deleteFile(tmpPath);
			throw error;
		}
	}

	async deleteFile(filepath: string | null): Promise<void> {
		if (!filepath) {
			return;
		}
		try {
			await fs.unlink(filepath);
		} catch (error: any) {
			if (error.code !== 'ENOENT') {
				throw error;
			}
		}
	}

	async deleteAllForUser(userId: number): Promise<void> {
		const files = await fs.readdir(this.dir);
		const userFiles = files.filter(f => f.startsWith(`${userId}.`));
		for (const file of userFiles) {
			await this.deleteFile(path.join(this.dir, file));
		}
	}

}
