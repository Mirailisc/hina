import { forwardRef, Module } from '@nestjs/common'
import { SearchService } from './search.service'
import { SearchResolver } from './search.resolver'
import { APP_FILTER } from '@nestjs/core'
import { SentryGlobalFilter } from '@sentry/nestjs/setup'
import { MetadataModule } from 'src/metadata/metadata.module'

@Module({
  imports: [forwardRef(() => MetadataModule)],
  providers: [
    SearchResolver,
    SearchService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
  exports: [SearchService],
})
export class SearchModule {}
