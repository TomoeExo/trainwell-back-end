import { Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { FileService } from 'src/file/file.service'
import { PrismaService } from 'src/prisma.service'
import { UserDto } from './dto/user.dto'

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private fileService: FileService
	) {}

	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id
			},
			include: {
				details: true,
				subscription: true,
				goals: true
			}
		})
	}

	async getProfile(id: string) {
		const profile = await this.getById(id)

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...rest } = profile
		return { user: rest }
	}

	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email
			}
		})
	}

	async create(dto: AuthDto) {
		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				name: '',
				password: await hash(dto.password),
				details: {
					create: {
						age: null,
						gender: '',
						height: null,
						weight: null
					}
				},
				subscription: {
					create: {
						subscriptionType: 'free',
						description: '',
						descriptionRequests: 10,
						chatRequests: 10
					}
				}
			}
		})

		return user
	}

	async update(id: string, dto: UserDto) {
		const data: any = { ...dto }

		if (dto.password) {
			data.password = await hash(dto.password)
		}

		const userDetailsUpdate = {
			age: dto.age,
			gender: dto.gender,
			height: dto.height,
			weight: dto.weight
		}

		return this.prisma.user.update({
			where: {
				id
			},
			data: {
				email: dto.email,
				name: dto.name,
				avatarImg: dto.avatarImg,
				details: {
					update: userDetailsUpdate
				}
			},
			select: {
				name: true,
				email: true,
				avatarImg: true,
				details: true
			}
		})
	}
}
