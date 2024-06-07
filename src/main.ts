import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv'
import { AppModule } from './app.module'

async function bootstrap() {
	dotenv.config()
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')
	app.use(cookieParser())
	app.enableCors({
		origin: ['http://localhost:3000', 'http://147.45.246.238:3000'],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})
	const port = process.env.PORT || 4200

	await app.listen(port)
}
bootstrap()
