import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    })
  }

  async createUser(username: string, password: string) {
    return this.prisma.user.create({
      data: { username, password },
    })
  }
}
