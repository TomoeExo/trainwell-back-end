import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { WorkoutCompletedDto } from './dto/workout-completed.dto'

@Injectable()
export class CompletedService {
	constructor(private prisma: PrismaService) {}

	async create(dto: WorkoutCompletedDto, userId: string) {
		return this.prisma.workoutCompleted.create({
			data: {
				totalSeconds: dto.totalSeconds,
				completedAt: new Date(),
				workout: {
					connect: {
						id: dto.workoutId,
						userId
					}
				}
			}
		})
	}

	async getAll(userId: string) {
		return this.prisma.workoutCompleted.findMany({
			where: {
				workout: {
					userId: userId
				}
			},
			include: {
				workout: true
			}
		})
	}

	async getByWorkout(workoutId: string, userId: string) {
		return this.prisma.workoutCompleted.findMany({
			where: {
				workout: {
					id: workoutId,
					userId
				}
			},
			include: {
				workout: true
			}
		})
	}
}
