import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType()
export class AuthorSearch {
  @Field(() => String)
  id: string

  @Field(() => String)
  name: string

  @Field(() => Int)
  totalPage: number
}
