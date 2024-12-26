import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private logger = new Logger(PrismaService.name)

  async onModuleInit() {
    await this.$connect()
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupExpiredImages() {
    try {
      const deletedImages = await this.images.deleteMany()

      this.logger.log(`Deleted ${deletedImages.count} expired images`)
    } catch (error) {
      this.logger.error('Error cleaning up expired images:', error)
    }
  }
}
