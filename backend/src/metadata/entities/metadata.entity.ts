import { ObjectType, Field } from '@nestjs/graphql'
import { Alternative } from './alternative.entity'
import { Chapter } from './chapter.entity'
import { Author } from 'src/author/entities/author.entity'

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

  @Field(() => Author)
  author: Author

  @Field(() => String, { nullable: true })
  cover: string

  @Field(() => String)
  description: string

  @Field(() => [Chapter])
  chapters: Chapter[]
}
