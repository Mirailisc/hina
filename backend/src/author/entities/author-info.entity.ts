import { ObjectType, Field } from '@nestjs/graphql'
import { Social } from './social.entity'
import { MangaSearch } from 'src/search/entities/MangaSearch.entity'
import { AuthorNoTotal } from './author-no-total.entity'

@ObjectType()
export class AuthorInfo extends AuthorNoTotal {
  @Field(() => Social, { nullable: true })
  social: Social

  @Field(() => [MangaSearch], { nullable: true })
  mangas: MangaSearch[]
}
