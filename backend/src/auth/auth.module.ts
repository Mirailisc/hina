import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { UserService } from 'src/user/user.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'kingTentacle420',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, AuthResolver, UserService, PrismaService],
})
export class AuthModule {}
