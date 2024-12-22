import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Chapter {
  @Field(() => String)
  id: string

  @Field(() => String)
  chapter: string

  @Field(() => String, { nullable: true })
  volume: string

  @Field(() => String, { nullable: true })
  title: string

  @Field(() => String)
  publishAt: string
}
