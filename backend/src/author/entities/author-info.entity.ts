import { ObjectType, Field } from '@nestjs/graphql'
import { Social } from './social.entity'
import { MangaSearch } from 'src/search/entities/MangaSearch.entity'

@ObjectType()
export class AuthorInfo {
  @Field(() => String)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String, { nullable: true })
  imageUrl: string

  @Field(() => Social, { nullable: true })
  social: Social

  @Field(() => [MangaSearch], { nullable: true })
  mangas: MangaSearch[]
}
