import { InputType, Field } from '@nestjs/graphql'

@InputType({ description: 'Get Metadata from MangaDex API and its chapters' })
export class MetadataInput {
  @Field(() => String, { description: 'Manga Id' })
  id: string

  @Field(() => String, { nullable: true })
  language: string
}
