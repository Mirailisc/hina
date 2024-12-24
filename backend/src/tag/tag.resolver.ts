import { Resolver, Query, Args } from '@nestjs/graphql'
import { Tags } from './entities/tags.entity'
import { TagService } from './tag.service'
import { MangaSearch } from 'src/search/entities/MangaSearch.entity'
import { TagSearchInput } from './dto/tagsearch.input'

@Resolver(() => Tags)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Query(() => [Tags])
  async getTags(): Promise<Tags[]> {
    return await this.tagService.getTags()
  }

  @Query(() => [MangaSearch])
  async getMangaByTags(@Args('input') input: TagSearchInput) {
    return await this.tagService.getMangaByTags(input.includedTags, input.page)
  }
}
