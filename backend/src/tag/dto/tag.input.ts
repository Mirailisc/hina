import { Field, InputType, Int } from '@nestjs/graphql'

@InputType({
  description: 'This input is used to get tag information and related mangas',
})
export class TagInput {
  @Field(() => String, { description: 'Tag id', nullable: false })
  id: string

  @Field(() => Int, {
    description: 'Manga page number',
    defaultValue: 1,
  })
  mangaPage: number
}
