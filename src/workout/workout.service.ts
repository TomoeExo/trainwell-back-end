import { Injectable } from '@nestjs/common'

import { getEmbedding } from 'src/lib/openai'
import { docIndex } from 'src/lib/pinecone'
import { PrismaService } from 'src/prisma.service'
import { WorkoutDto } from './dto/workout.dto'

@Injectable()
export class WorkoutService {
	constructor(private prisma: PrismaService) {}

	async getAll(userId: string) {
		return this.prisma.workout.findMany({
			where: { userId }
		})
	}

	async getById(id: string) {
		return this.prisma.workout.findUnique({
			where: { id }
		})
	}

	async create(dto: WorkoutDto, userId: string) {
		const workout = await this.prisma.workout.create({
			data: {
				title: dto.title,
				description: dto.description,
				level: dto.level,
				type: dto.type,
				duration: dto.duration,
				tags: dto.tags,
				isFavorite: dto.isFavorite,
				completed: dto.completed,
				user: {
					connect: { id: userId }
				},
				exercises: dto.exercises as any // Приведение типа к any, чтобы избежать ошибки
			}
		})
		const embedding = await this.getEmbeddingForWorkout(
			dto.title,
			dto.description,
			dto.level,
			dto.type,
			dto.duration,
			dto.tags,
			dto.exercises
		)
		await docIndex.upsert([
			{
				id: workout.id,
				values: embedding,
				metadata: { userId }
			}
		])

		return workout
	}

	async update(dto: Partial<WorkoutDto>, workoutId: string, userId: string) {
		return this.prisma.workout.update({
			where: {
				id: workoutId,
				userId
			},
			data: {
				title: dto.title,
				description: dto.description,
				level: dto.level,
				type: dto.type,
				duration: dto.duration,
				isFavorite: dto.isFavorite,
				completed: dto.completed,
				tags: dto.tags,
				exercises: dto.exercises as any // Приведение типа к any, чтобы избежать ошибки
			}
		})
	}

	async delete(workoutId: string, userId: string) {
		// Удаляем все связанные записи в WorkoutCompleted
		await this.prisma.workoutCompleted.deleteMany({
			where: {
				workoutId: workoutId
			}
		})

		// Теперь удаляем тренировку
		return this.prisma.workout.delete({
			where: {
				id: workoutId,
				userId
			}
		})
	}

	async getEmbeddingForWorkout(
		title: string,
		description: string | undefined,
		level: string,
		type: string[],
		duration: number,
		tags: string[],
		exercises: any
	) {
		return getEmbedding(
			title +
				'\n\n' +
				description +
				'\n\n' +
				level +
				'\n\n' +
				type +
				'\n\n' +
				duration +
				'\n\n' +
				tags +
				'\n\n' +
				exercises ?? ''
		)
	}

	async getByIds(ids: string[]) {
		return this.prisma.workout.findMany({
			where: {
				id: {
					in: ids
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
	}
}
