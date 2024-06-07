import { IsInt, IsString } from 'class-validator'

export class WorkoutCompletedDto {
	@IsString()
	workoutId: string

	@IsInt()
	totalSeconds: number
}
