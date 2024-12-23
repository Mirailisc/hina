import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class AuthorNoTotal {
  @Field(() => String)
  id: string

  @Field(() => String)
  name: string
}
