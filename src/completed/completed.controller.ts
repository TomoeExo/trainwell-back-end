import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { CompletedService } from './completed.service'
import { WorkoutCompletedDto } from './dto/workout-completed.dto'

@Controller('user/workout/completed')
export class CompletedController {
	constructor(private readonly completedService: CompletedService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async create(
		@Body() dto: WorkoutCompletedDto,
		@CurrentUser('id') userId: string
	) {
		return this.completedService.create(dto, userId)
	}

	@Get()
	@Auth()
	async getAll(@CurrentUser('id') userId: string) {
		return this.completedService.getAll(userId)
	}

	@Get(':id')
	@Auth()
	async getByWorkout(
		@Param('id') id: string,
		@CurrentUser('id') userId: string
	) {
		return this.completedService.getByWorkout(id, userId)
	}
}
