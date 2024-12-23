import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class Author {
  @Field(() => String)
  id: string

  @Field(() => String)
  name: string
}
