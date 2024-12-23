import { Resolver, Query, Args } from '@nestjs/graphql'
import { AuthorService } from './author.service'
import { Author } from './entities/author.entity'
import { AuthorsInput } from './dto/authors.input'
import { AuthorInfo } from './entities/author-info.entity'
import { AuthorInput } from './dto/author'

@Resolver(() => Author)
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService) {}

  @Query(() => [Author])
  async getAuthors(@Args('input') input: AuthorsInput): Promise<Author[]> {
    return await this.authorService.getAuthors(input.page, input.name)
  }

  @Query(() => AuthorInfo)
  async getAuthorInfo(@Args('input') input: AuthorInput): Promise<AuthorInfo> {
    return await this.authorService.getAuthorInfo(input.id, input.mangaPage)
  }
}
