import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { GoalDto } from './dto/goal.dto'

@Injectable()
export class GoalService {
	constructor(private prisma: PrismaService) {}

	async getAll(userId: string) {
		return this.prisma.goal.findMany({
			where: {
				userId
			}
		})
	}

	async create(dto: GoalDto, userId: string) {
		return this.prisma.goal.create({
			data: {
				...dto,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
	}

	async update(dto: Partial<GoalDto>, goalId: string, userId: string) {
		return this.prisma.goal.update({
			where: {
				userId,
				id: goalId
			},
			data: dto
		})
	}

	async delete(goalId: string) {
		return this.prisma.goal.delete({
			where: {
				id: goalId
			}
		})
	}
}
