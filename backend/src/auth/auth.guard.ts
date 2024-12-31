import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from './auth.service'

@Injectable()
export class AuthGuard {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const { req } = ctx.getContext()

    const authHeader = req.headers.authorization
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing')
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException('Invalid authorization token')
    }

    try {
      const payload = this.jwtService.verify(token)
      const user = await this.authService.validateUser(payload.username)
      if (!user) {
        throw new UnauthorizedException('User not found')
      }
      req.user = user
      return true
    } catch {
      throw new UnauthorizedException('Invalid or expired token')
    }
  }
}
