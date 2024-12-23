import { ObjectType, Field } from '@nestjs/graphql'
import { Chapter } from './chapter.entity'
import { AuthorNoTotal } from 'src/author/entities/author-no-total.entity'
import { Alternative } from './alternative.entity'

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

  @Field(() => AuthorNoTotal)
  author: AuthorNoTotal

  @Field(() => String, { nullable: true })
  cover: string

  @Field(() => String)
  description: string

  @Field(() => [Chapter])
  chapters: Chapter[]
}
