import { Resolver, Query, Args } from '@nestjs/graphql'
import { AuthorService } from './author.service'
import { AuthorSearch } from './entities/AuthorSearch.entity'
import { AuthorsInput } from './dto/authors.input'
import { AuthorInfo } from './entities/AuthorInfo.entity'
import { AuthorInput } from './dto/author.input'

@Resolver(() => AuthorSearch)
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService) {}

  @Query(() => [AuthorSearch])
  async getAuthors(
    @Args('input') input: AuthorsInput,
  ): Promise<AuthorSearch[]> {
    return await this.authorService.getAuthors(input.page, input.name)
  }

  @Query(() => AuthorInfo)
  async getAuthorInfo(@Args('input') input: AuthorInput): Promise<AuthorInfo> {
    return await this.authorService.getAuthorInfo(input.id, input.mangaPage)
  }
}
