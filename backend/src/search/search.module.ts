import { Module } from '@nestjs/common'
import { SearchService } from './search.service'
import { SearchResolver } from './search.resolver'
import { APP_FILTER } from '@nestjs/core'
import { SentryGlobalFilter } from '@sentry/nestjs/setup'

@Module({
  providers: [
    SearchResolver,
    SearchService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class SearchModule {}
