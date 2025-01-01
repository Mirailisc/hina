import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class BookmarkedManga {
  @Field(() => String)
  id: string

  @Field(() => String, { nullable: true })
  title: string

  @Field(() => String)
  status: string

  @Field(() => String, { nullable: true })
  cover: string
}
