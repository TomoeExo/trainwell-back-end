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
import { Chat } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { ChatService } from './chat.service'
import { MessageDto } from './dto/chat.dto'

@Controller('user/chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async create(@CurrentUser('id') userId: string) {
		return this.chatService.createChat(userId)
	}

	@Get(':id')
	@Auth()
	async getChat(@Param('id') chatId: string): Promise<Chat | null> {
		return this.chatService.getChat(chatId)
	}

	@Get()
	@Auth()
	async getAll(@CurrentUser('id') userId: string) {
		return this.chatService.getAll(userId)
	}

	@Get(':id/messages')
	@Auth()
	async getMessages(@Param('id') chatId: string): Promise<MessageDto[]> {
		const messages = await this.chatService.getMessages(chatId)
		return messages.map(message => ({
			role: message.role,
			content: [{ text: message.content }]
		}))
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async update(
		@Param('id') chatId: string,
		@Body() body: { content: string },
		@CurrentUser('id') userId: string
	): Promise<any> {
		const response = await this.chatService.updateChat(
			chatId,
			body.content,
			userId
		)
		return response
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async delete(@Param('id') chatId: string): Promise<Chat | null> {
		return this.chatService.deleteChat(chatId)
	}
}
