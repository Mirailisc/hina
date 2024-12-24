import { Field, InputType, Int } from '@nestjs/graphql'

@InputType({
  description: 'This input is used to search related mangas by included tags',
})
export class TagSearchInput {
  @Field(() => [String], {
    description: 'Include manga tags',
    defaultValue: [],
  })
  includedTags: string[]

  @Field(() => Int, {
    description: 'Manga page number',
    defaultValue: 1,
  })
  page: number
}
