import { forwardRef, Module } from '@nestjs/common'
import { AuthorService } from './author.service'
import { AuthorResolver } from './author.resolver'
import { APP_FILTER } from '@nestjs/core'
import { SentryGlobalFilter } from '@sentry/nestjs/setup'
import { SearchModule } from 'src/search/search.module'

@Module({
  imports: [forwardRef(() => SearchModule)],
  providers: [
    AuthorResolver,
    AuthorService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
  exports: [AuthorService],
})
export class AuthorModule {}
