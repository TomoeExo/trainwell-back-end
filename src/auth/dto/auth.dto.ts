import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class SubscriptionType {
	subscriptionType?: string

	@IsString()
	@IsOptional()
	description?: string

	descriptionRequests?: number

	chatRequests?: number
}

export class AuthDto {
	@IsString()
	@IsOptional()
	name?: string

	@IsEmail()
	email: string

	@MinLength(6, {
		message: 'Password must be at least 6 characters long'
	})
	@IsString()
	password: string

	subscription: SubscriptionType
}
