import { IsBoolean, IsISO8601, IsOptional, IsString } from 'class-validator'

export class GoalDto {
	@IsString()
	title: string

	@IsOptional()
	@IsString()
	description?: string

	@IsOptional()
	@IsISO8601()
	deadline?: Date

	@IsOptional()
	@IsBoolean()
	completed?: boolean
}
