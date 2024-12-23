import { InputType, Field, Int } from '@nestjs/graphql'

@InputType({ description: 'Search manga from MangaDex API' })
export class SearchInput {
  @Field(() => String, { description: 'Manga name', nullable: true })
  name: string

  @Field(() => Int, {
    description: 'Search limit',
    nullable: true,
    defaultValue: 10,
  })
  amount: number

  @Field(() => Int, {
    description: 'Page number',
    defaultValue: 1,
  })
  page: number
}
