import { Injectable } from '@nestjs/common'
import { Chat, Message } from '@prisma/client'
import {
	ChatCompletionFunctionMessageParam,
	ChatCompletionMessageParam,
	ChatCompletionSystemMessageParam
} from 'openai/resources'
import openai, { getEmbedding } from 'src/lib/openai'
import { docIndex } from 'src/lib/pinecone'
import { PrismaService } from 'src/prisma.service'
import { WorkoutService } from 'src/workout/workout.service'

@Injectable()
export class ChatService {
	constructor(
		private prisma: PrismaService,
		private readonly workoutService: WorkoutService
	) {}

	async createChat(userId: string): Promise<Chat> {
		return this.prisma.chat.create({
			data: {
				user: { connect: { id: userId } }
			}
		})
	}

	async getAll(userId: string) {
		return this.prisma.chat.findMany({
			where: { userId }
		})
	}

	async getChat(chatId: string): Promise<Chat | null> {
		return this.prisma.chat.findUnique({
			where: { id: chatId }
		})
	}

	async getMessages(chatId: string): Promise<Message[]> {
		try {
			return await this.prisma.message.findMany({
				where: { chatId }
			})
		} catch (error) {
			// Обработка ошибки получения сообщений
			throw new Error('Failed to get messages')
		}
	}

	async updateChat(chatId: string, content: string, userId: string) {
		const existingChat = await this.getChat(chatId)

		if (!existingChat) {
			return null
		}

		// Get user and subscription details
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: { subscription: true }
		})

		if (!user || !user.subscription) {
			return {
				role: 'assistant',
				content: 'User or subscription not found'
			}
		}

		if (user.subscription.chatRequests <= 0) {
			return {
				role: 'assistant',
				content: 'You have no chat requests left.'
			}
		}

		// Decrease the number of chat requests
		await this.prisma.subscription.update({
			where: { id: user.subscription.id },
			data: { chatRequests: user.subscription.chatRequests - 1 }
		})

		const messages = await this.getMessages(chatId)
		const lastMessages = messages.slice(-6)

		const messagesTruncated = messages.slice(-1)

		const embedding = await getEmbedding(
			messagesTruncated.map(message => message.content).join('\n')
		)

		const vectorQueryResponse = await docIndex.query({
			vector: embedding,
			topK: 4,
			filter: { userId }
		})

		const relevantEmbedding = await this.workoutService.getByIds(
			vectorQueryResponse.matches.map(match => match.id)
		)

		const systemMessage: ChatCompletionSystemMessageParam = {
			role: 'system',
			content:
				'Ты помогаешь советами пользователю в первую очередь, Запрещается упоминать о создании тренировки.\n\n Если пользователь просит создать тренировку, создавай по этому шаблону(Исключи поля \'id\', \'createdAt\', \'updatedAt\', \'userId\'): \'/create_workout:\' { "title": "TW Название тренировки", "description": "Описание тренировки", "level": "Уровень (low, medium, high)", "type": [ "Тип тренировки (например, Strength, Cardio, Endurance и т.д.)" ], "duration": "Длительность тренировки в минутах (type number) пиши чтолько число", "tags": [ "Теги тренировки (например, Full Body, Strength, Endurance и т.д.)" ], "completed": false, "exercises": [ { "title": "Название упражнения", "sets": "Количество сетов (type number) пиши чтолько число", "reps": "Количество повторений (type number) пиши чтолько число" }, { "title": "Название упражнения", "sets": "Количество сетов (type number) пиши чтолько число", "reps": "Количество повторений (type number) пиши чтолько число" } ] } Инструкции: 1. Используй предоставленный шаблон для создания структуры тренировки. 2. Убедись, что все поля заполнены корректно и добавлены все необходимые данные. 3. В поле \'title\' тренировки обязательно добавь префикс \'TW\' перед названием тренировки. 4. Добавляй минимум 5 упражнений' +
				relevantEmbedding
					.map((object: any) => JSON.stringify(object, null, 2))
					.join('\n\n')
		}

		const allMessages: ChatCompletionMessageParam[] = [
			systemMessage,
			...lastMessages.map(
				message =>
					({
						role: message.role,
						content: message.content
					}) as ChatCompletionFunctionMessageParam
			),
			{ role: 'user', content: content }
		]

		const response = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: allMessages
		})

		if (response.choices[0].message.content.startsWith('/create_workout:')) {
			const workoutDataString = response.choices[0].message.content
				.replace('/create_workout:', '')
				.trim()
			const workoutData = JSON.parse(workoutDataString)

			const responseCreateWorkout = {
				title: workoutData.title,
				description: workoutData.description,
				level: workoutData.level,
				type: workoutData.type,
				duration: workoutData.duration,
				tags: workoutData.tags,
				isFavorite: false,
				completed: workoutData.completed,
				exercises: workoutData.exercises
			}
			try {
				const createdWorkout = await this.workoutService.create(
					responseCreateWorkout,
					userId
				)
				console.log('Workout created successfully:', createdWorkout)
				return {
					role: 'assistant',
					content: 'Workout created successfully'
				}
			} catch (error) {
				console.error('Failed to create workout:', error)
			}
		} else {
			const botMessage = {
				role: 'assistant',
				content: response.choices[0].message.content
			}
			const updatedMessages = [{ role: 'user', content: content }, botMessage]

			await this.prisma.chat.update({
				where: { id: chatId },
				data: {
					messages: {
						create: updatedMessages.map(message => ({
							role: message.role,
							content: message.content
						}))
					}
				}
			})

			return response.choices[0].message
		}
	}

	async deleteChat(chatId: string): Promise<Chat | null> {
		try {
			await this.prisma.$transaction([
				this.prisma.message.deleteMany({
					where: { chatId: chatId }
				}),
				this.prisma.chat.delete({
					where: { id: chatId }
				})
			])
			return null
		} catch (error) {
			console.error('Failed to delete chat:', error)
			return null
		}
	}
}
