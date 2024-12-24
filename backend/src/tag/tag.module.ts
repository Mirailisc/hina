import { forwardRef, Module } from '@nestjs/common'
import { TagService } from './tag.service'
import { TagResolver } from './tag.resolver'
import { SearchModule } from 'src/search/search.module'

@Module({
  imports: [forwardRef(() => SearchModule)],
  providers: [TagResolver, TagService],
})
export class TagModule {}
