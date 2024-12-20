import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Alternative {
  @Field(() => String, { nullable: true })
  en: string

  @Field(() => String, { nullable: true })
  ja: string

  @Field(() => String, { nullable: true })
  romaji: string
}
