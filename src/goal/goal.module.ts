import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { GoalController } from './goal.controller'
import { GoalService } from './goal.service'

@Module({
	controllers: [GoalController],
	providers: [GoalService, PrismaService]
})
export class GoalModule {}
