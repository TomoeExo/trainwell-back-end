import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator'

export class WorkoutDto {
	@IsString()
	title: string

	@IsOptional()
	@IsString()
	description?: string

	@IsOptional()
	@IsString()
	level?: string

	@IsArray()
	type: string[]

	@IsOptional()
	duration?: number

	@IsArray()
	tags: string[]

	@IsOptional()
	@IsBoolean()
	isFavorite?: boolean

	@IsOptional()
	@IsBoolean()
	completed?: boolean

	@IsArray()
	exercises: {
		title: string
		sets: number
		reps: number
	}[]
}
