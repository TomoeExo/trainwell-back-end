import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CompletedController } from './completed.controller'
import { CompletedService } from './completed.service'

@Module({
	controllers: [CompletedController],
	providers: [CompletedService, PrismaService]
})
export class CompletedModule {}
