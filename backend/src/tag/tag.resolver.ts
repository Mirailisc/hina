import { Resolver, Query } from '@nestjs/graphql'
import { Tags } from './entities/tags.entity'
import { TagService } from './tag.service'

@Resolver(() => Tags)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Query(() => [Tags])
  async getTags(): Promise<Tags[]> {
    return await this.tagService.getTags()
  }
}
