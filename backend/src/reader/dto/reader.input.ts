import { InputType, Field } from '@nestjs/graphql'

@InputType({ description: 'View manga chapter images' })
export class ReaderInput {
  @Field(() => String, { description: 'Chapter Id', nullable: false })
  id: string

  @Field(() => String, {
    description: 'Image Quality',
    nullable: false,
    defaultValue: 'data',
  })
  quality: 'data' | 'dataSaver'
}
