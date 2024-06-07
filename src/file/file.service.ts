import { Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'
import { PrismaService } from 'src/prisma.service'
import { FileResponse } from './dto/file.response'

@Injectable()
export class FileService {
	constructor(private readonly prisma: PrismaService) {}

	async uploadAvatar(
		file: Express.Multer.File,
		folder: string = 'default'
	): Promise<FileResponse> {
		if (!file || !file.originalname) {
			throw new Error('Invalid file provided')
		}

		const uploadFolder = `${path}/uploads/${folder}`
		await ensureDir(uploadFolder)
		await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer)

		return {
			url: `/uploads/${folder}/${file.originalname}`,
			name: file.originalname
		}
	}

	// async uploadWorkoutBanner(workoutId: string, file: Express.Multer.File) {
	// 	const workout = await this.prisma.workout.findUnique({
	// 		where: { id: workoutId },
	// 		select: { workoutImg: true }
	// 	})

	// 	if (workout?.workoutImg) {
	// 		const bannerPath = path.join(
	// 			__dirname,
	// 			'..',
	// 			'uploads',
	// 			'banners',
	// 			workout.workoutImg
	// 		)
	// 		if (existsSync(bannerPath)) {
	// 			unlinkSync(bannerPath)
	// 		}
	// 	}

	// 	const fileName = `${Date.now()}-${file.originalname}`
	// 	writeFileSync(
	// 		path.join(__dirname, '..', 'uploads', 'banners', fileName),
	// 		file.buffer
	// 	)

	// 	await this.prisma.workout.update({
	// 		where: { id: workoutId },
	// 		data: { workoutImg: fileName }
	// 	})

	// 	return fileName
	// }
}
