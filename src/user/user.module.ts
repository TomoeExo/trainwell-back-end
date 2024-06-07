import { Module } from '@nestjs/common'
import { FileService } from 'src/file/file.service'
import { PrismaService } from 'src/prisma.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	controllers: [UserController],
	providers: [UserService, PrismaService, FileService],
	exports: [UserService]
})
export class UserModule {}
