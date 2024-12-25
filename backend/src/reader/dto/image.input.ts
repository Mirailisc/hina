import { InputType, Field } from '@nestjs/graphql'

@InputType({ description: 'Fetch image blob' })
export class ImageInput {
  @Field(() => String)
  imageUrl: string
}
