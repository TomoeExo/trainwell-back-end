import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { ChatModule } from './chat/chat.module'
import { CompletedModule } from './completed/completed.module'

import { FileModule } from './file/file.module'
import { GoalModule } from './goal/goal.module'
import { UserModule } from './user/user.module'
import { WorkoutModule } from './workout/workout.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		WorkoutModule,
		GoalModule,
		ChatModule,

		CompletedModule,
		FileModule
	]
})
export class AppModule {}
