import { InputType, Field, Int } from '@nestjs/graphql'

@InputType({ description: 'Search manga by tags from MangaDex API' })
export class SearchTagsInput {
  @Field(() => Int, {
    description: 'Search limit',
    nullable: true,
    defaultValue: 10,
  })
  amount: number

  @Field(() => [String], { description: 'Include manga tags', nullable: true })
  includedTags: string[]

  @Field(() => [String], { description: 'Exclude Manga tags', nullable: true })
  excludedTags: string[]

  @Field(() => Int, {
    description: 'Page number',
    defaultValue: 1,
  })
  page: number
}
