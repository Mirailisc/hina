import { Field, InputType, Int } from '@nestjs/graphql'

@InputType({
  description:
    'This input is used to get author information and related mangas',
})
export class AuthorInput {
  @Field(() => String, { description: 'Author id', nullable: false })
  id: string

  @Field(() => Int, {
    description: 'Manga page number',
    defaultValue: 1,
  })
  mangaPage: number
}
