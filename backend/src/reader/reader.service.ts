import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { axiosInstance } from 'src/lib/axios'

@Injectable()
export class ReaderService {
  constructor(@Inject('CACHE_MANAGER') private cacheManager: Cache) {}

  async getChapterImages(
    chapterId: string,
    quality: string,
  ): Promise<string[]> {
    const cacheKey = `chapter-images-${chapterId}-${quality}`

    const cachedImages = await this.cacheManager.get<string[]>(cacheKey)
    if (cachedImages) {
      return cachedImages
    }

    const url = `https://api.mangadex.org/at-home/server/${chapterId}`

    try {
      const response = await axiosInstance.get(url)
      const { baseUrl, chapter } = response.data

      if (!baseUrl || !chapter || !chapter.hash || !chapter[quality]) {
        throw new NotFoundException('Invalid chapter data')
      }

      const imageUrls = chapter[quality].map(
        (filename: string) =>
          `${baseUrl}/${quality}/${chapter.hash}/${filename}`,
      )

      await this.cacheManager.set(cacheKey, imageUrls)

      return imageUrls
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch chapter images: ${error.message}`,
      )
    }
  }
}
