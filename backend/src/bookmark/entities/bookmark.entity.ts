import { Field, ObjectType } from '@nestjs/graphql'
import { BookmarkedManga } from './bookmarked-manga'

@ObjectType()
export class Bookmark {
  @Field(() => String)
  id: string

  @Field(() => BookmarkedManga)
  manga: BookmarkedManga

  @Field(() => String)
  currentChapter: string
}
