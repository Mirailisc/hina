import { ObjectType, Field } from '@nestjs/graphql'
import { Alternative } from './Alternative.entity'

@ObjectType()
export class Metadata {
  @Field(() => String)
  id: string

  @Field(() => String)
  title: string

  @Field(() => Alternative)
  alternative: Alternative

  @Field(() => String)
  status: string

  @Field(() => String)
  author: string

  @Field(() => String, { nullable: true })
  cover: string

  @Field(() => String)
  description: string

  @Field(() => [String])
  chapters: string[]
}
