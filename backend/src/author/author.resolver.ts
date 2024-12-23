import { Resolver, Query, Args } from '@nestjs/graphql'
import { AuthorService } from './author.service'
import { AuthorSearch } from './entities/authorsearch.entity'
import { AuthorsInput } from './dto/authors.input'
import { AuthorInfo } from './entities/authorinfo.entity'
import { AuthorInput } from './dto/author'
import { Author } from './entities/author.entity'

@Resolver(() => Author)
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService) {}

  @Query(() => [Author])
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
