import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { WorkoutDto } from './dto/workout.dto'
import { WorkoutService } from './workout.service'

@Controller('user/workout')
export class WorkoutController {
	constructor(private readonly workoutService: WorkoutService) {}

	@Get()
	@Auth()
	async getAll(@CurrentUser('id') userId: string) {
		return this.workoutService.getAll(userId)
	}

	@Get('update/:id')
	@Auth()
	async getWorkout(@Param('id') id: string) {
		return this.workoutService.getById(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async create(@Body() dto: WorkoutDto, @CurrentUser('id') userId: string) {
		return this.workoutService.create(dto, userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('update/:id')
	@Auth()
	async update(
		@Body() dto: WorkoutDto,
		@CurrentUser('id') userId: string,
		@Param('id') id: string
	) {
		return this.workoutService.update(dto, id, userId)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.workoutService.delete(id, userId)
	}
}
