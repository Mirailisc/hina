import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class Social {
  @Field(() => String, { nullable: true })
  twitter: string

  @Field(() => String, { nullable: true })
  pixiv: string

  @Field(() => String, { nullable: true })
  melonBook: string

  @Field(() => String, { nullable: true })
  fanBox: string

  @Field(() => String, { nullable: true })
  nicoVideo: string

  @Field(() => String, { nullable: true })
  fantia: string

  @Field(() => String, { nullable: true })
  tumblr: string

  @Field(() => String, { nullable: true })
  youtube: string

  @Field(() => String, { nullable: true })
  weibo: string

  @Field(() => String, { nullable: true })
  website: string
}
