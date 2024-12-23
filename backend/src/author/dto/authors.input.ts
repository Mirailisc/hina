import { Field, InputType, Int } from '@nestjs/graphql'

@InputType({
  description: 'This input is used to get authors through pagination',
})
export class AuthorsInput {
  @Field(() => Int, { description: 'Page number', defaultValue: 1 })
  page: number

  @Field(() => String, {
    description: 'Author name',
    defaultValue: '',
  })
  name: string
}
