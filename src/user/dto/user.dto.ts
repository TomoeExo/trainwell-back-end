import {
	IsEmail,
	IsInt,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator'

export class UserDetails {
	@IsOptional()
	@IsInt()
	age?: number

	@IsOptional()
	@IsString()
	gender?: string

	@IsOptional()
	height?: number

	@IsOptional()
	weight?: number
}

export class UserDto extends UserDetails {
	@IsEmail()
	@IsOptional()
	email?: string

	@IsString()
	@IsOptional()
	avatarImg?: string

	@IsString()
	@IsOptional()
	name?: string

	@IsOptional()
	@MinLength(6, {
		message: 'Password must be at least 6 characters long'
	})
	@IsString()
	password?: string
}
