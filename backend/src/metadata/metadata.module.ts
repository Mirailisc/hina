import { forwardRef, Module } from '@nestjs/common'
import { MetadataService } from './metadata.service'
import { MetadataResolver } from './metadata.resolver'
import { SentryGlobalFilter } from '@sentry/nestjs/setup'
import { APP_FILTER } from '@nestjs/core'
import { AuthorModule } from 'src/author/author.module'

@Module({
  imports: [forwardRef(() => AuthorModule)],
  providers: [
    MetadataResolver,
    MetadataService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
  exports: [MetadataService],
})
export class MetadataModule {}
