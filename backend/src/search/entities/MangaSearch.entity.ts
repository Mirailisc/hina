import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType()
export class MangaSearch {
  @Field(() => String)
  id: string

  @Field(() => String, { nullable: true })
  title: string

  @Field(() => String)
  status: string

  @Field(() => String, { nullable: true })
  cover: string

  @Field(() => Int)
  totalPage: number
}
