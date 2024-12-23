import { ObjectType, Field } from '@nestjs/graphql'
import { Social } from './social.entity'
import { MangaSearch } from 'src/search/entities/mangasearch.entity'
import { Author } from './author.entity'

@ObjectType()
export class AuthorInfo extends Author {
  @Field(() => Social, { nullable: true })
  social: Social

  @Field(() => [MangaSearch], { nullable: true })
  mangas: MangaSearch[]
}
