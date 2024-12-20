import { Module } from '@nestjs/common'
import { MetadataService } from './metadata.service'
import { MetadataResolver } from './metadata.resolver'
import { SearchService } from 'src/search/search.service'
import { SentryGlobalFilter } from '@sentry/nestjs/setup'
import { APP_FILTER } from '@nestjs/core'

@Module({
  providers: [
    MetadataResolver,
    MetadataService,
    SearchService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class MetadataModule {}
