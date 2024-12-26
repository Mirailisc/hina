import { Resolver, Query, Args } from '@nestjs/graphql'
import { ReaderService } from './reader.service'
import { ReaderInput } from './dto/reader.input'
import { ImageInput } from './dto/image.input'

@Resolver(() => [String])
export class ReaderResolver {
  constructor(private readonly readerService: ReaderService) {}

  @Query(() => [String])
  async chapterImages(@Args('input') input: ReaderInput): Promise<string[]> {
    return await this.readerService.getChapterImages(
      input.id,
      input.nextChapters,
      input.quality,
    )
  }

  @Query(() => String)
  async fetchImage(@Args('input') input: ImageInput): Promise<string> {
    return this.readerService.fetchImage(input.imageUrl)
  }
}
