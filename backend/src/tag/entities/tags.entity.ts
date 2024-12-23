import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class Tags {
  @Field(() => String)
  id: string

  @Field(() => String)
  name: string
}
