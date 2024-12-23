import { ObjectType, Field } from '@nestjs/graphql'
import { Social } from './Social.entity'
import { MangaSearch } from 'src/search/entities/MangaSearch.entity'
import { Author } from './Author.entity'

@ObjectType()
export class AuthorInfo extends Author {
  @Field(() => Social, { nullable: true })
  social: Social

  @Field(() => [MangaSearch], { nullable: true })
  mangas: MangaSearch[]
}
