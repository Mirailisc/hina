import { Module } from '@nestjs/common'
import { ReaderService } from './reader.service'
import { ReaderResolver } from './reader.resolver'
import { SentryGlobalFilter } from '@sentry/nestjs/setup'
import { APP_FILTER } from '@nestjs/core'

@Module({
  providers: [
    ReaderService,
    ReaderResolver,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class ReaderModule {}
