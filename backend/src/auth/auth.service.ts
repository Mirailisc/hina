import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { RegisterInput } from './dto/register.input'
import * as bcrypt from 'bcrypt'
import { UserService } from 'src/user/user.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'

const HASH_PASSWORD_SALT = 10

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name)

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(input: RegisterInput) {
    const user = await this.userService.findUserByUsername(input.username)

    if (user) {
      throw new BadRequestException('User already exists')
    }

    if (input.password !== input.confirmPassword) {
      throw new BadRequestException('Passwords do not match')
    }

    const hashedPassword = await bcrypt.hash(input.password, HASH_PASSWORD_SALT)

    const result = await this.userService.createUser(
      input.username,
      hashedPassword,
    )

    this.logger.log(`User ${input.username} registered`)

    return result
  }

  async login(
    username: string,
    password: string,
  ): Promise<{ token: string; user: User }> {
    const user = await this.prisma.user.findUnique({ where: { username } })

    if (!user) {
      throw new UnauthorizedException('Incorrect username or password')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect username or password')
    }

    const token = this.jwtService.sign({ username: user.username })

    return { token, user }
  }

  async validateUser(username: string) {
    return await this.prisma.user.findUnique({ where: { username } })
  }
}
