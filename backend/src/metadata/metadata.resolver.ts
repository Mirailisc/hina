import { Resolver, Query, Args } from '@nestjs/graphql'
import { MetadataService } from './metadata.service'
import { Metadata } from './entities/metadata.entity'
import { MetadataInput } from './dto/get-metadata.input'

@Resolver(() => Metadata)
export class MetadataResolver {
  constructor(private readonly metadataService: MetadataService) {}

  @Query(() => Metadata)
  async metadata(@Args('id') input: MetadataInput): Promise<Metadata> {
    return await this.metadataService.getMetadata(input.id)
  }
}
