import { Resolver, Query, Args } from '@nestjs/graphql'
import { SearchService } from './search.service'
import { MangaSearch } from './entities/MangaSearch.entity'
import { SearchInput } from './dto/search.input'
import { SearchTagsInput } from './dto/search-tags.input'

@Resolver(() => MangaSearch)
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => [MangaSearch])
  async searchMetadata(
    @Args('input') input: SearchInput,
  ): Promise<MangaSearch[]> {
    return await this.searchService.search(input.name, input.amount, input.page)
  }

  @Query(() => [MangaSearch])
  async searchByTags(
    @Args('input') input: SearchTagsInput,
  ): Promise<MangaSearch[]> {
    return await this.searchService.searchByTag(
      input.includedTags,
      input.excludedTags,
      input.amount,
      input.page,
    )
  }
}
