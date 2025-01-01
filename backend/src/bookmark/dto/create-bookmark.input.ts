import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CreateBookmarkInput {
  @Field(() => String)
  mangaId: string
}
