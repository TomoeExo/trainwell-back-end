import {
	Controller,
	HttpCode,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { FileService } from './file.service'

@Controller('user/files')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	@UseInterceptors(FileInterceptor('file'))
	async uploadAvatar(
		@UploadedFile() file: Express.Multer.File,
		@Query('folder') folder?: string
	) {
		return await this.fileService.uploadAvatar(file, folder)
	}

	// @UsePipes(new ValidationPipe())
	// @HttpCode(200)
	// @Post(':id')
	// @Auth()
	// @UseInterceptors(FileInterceptor('file'))
	// async uploadWorkoutBanner(
	// 	@UploadedFile() file: Express.Multer.File,
	// 	@Param('workoutId') workoutId: string
	// ) {
	// 	return await this.fileService.uploadWorkoutBanner(workoutId, file)
	// }
}
