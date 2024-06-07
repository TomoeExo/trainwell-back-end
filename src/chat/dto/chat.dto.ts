import { IsArray, IsString, ValidateNested } from 'class-validator'

export class MessageDto {
	@IsString()
	role: 'assistant' | 'system' | 'user' | string

	@IsArray()
	@ValidateNested({ each: true })
	content: MessageContentDto[]
}

class MessageContentDto {
	@IsString()
	text?: string
}
