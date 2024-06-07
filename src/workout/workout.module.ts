import { Module } from '@nestjs/common'

import { PrismaService } from 'src/prisma.service'
import { WorkoutController } from './workout.controller'
import { WorkoutService } from './workout.service'

@Module({
	controllers: [WorkoutController],
	providers: [WorkoutService, PrismaService]
})
export class WorkoutModule {}
