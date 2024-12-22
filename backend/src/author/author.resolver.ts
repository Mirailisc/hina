import { Resolver, Query, Args } from '@nestjs/graphql'
import { AuthorService } from './author.service'
import { Author } from './entities/author.entity'
import { AuthorsInput } from './dto/authors.input'

@Resolver(() => Author)
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService) {}

  @Query(() => [Author])
  async getAuthors(@Args('input') input: AuthorsInput): Promise<Author[]> {
    return await this.authorService.getAuthors(input.page)
  }
}
