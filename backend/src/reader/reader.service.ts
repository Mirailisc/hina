import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { axiosInstance } from 'src/lib/axios'
import { MANGADEX_API } from 'src/lib/constants'

@Injectable()
export class ReaderService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getChapterImages(
    chapterId: string,
    nextChapters: string[] | null,
    quality: string,
  ): Promise<string[]> {
    const imageUrls: string[] = []

    const currentChapterCacheKey = `chapter-images-${chapterId}-${quality}`
    const cachedCurrentChapterImages = await this.cacheManager.get<string[]>(
      currentChapterCacheKey,
    )

    if (cachedCurrentChapterImages) {
      imageUrls.push(...cachedCurrentChapterImages)
    } else {
      try {
        const currentChapterImages = await this.fetchChapterImages(
          chapterId,
          quality,
        )
        await this.cacheManager.set(
          currentChapterCacheKey,
          currentChapterImages,
        )
        imageUrls.push(...currentChapterImages)
      } catch (error) {
        throw new InternalServerErrorException(
          `Failed to fetch current chapter images: ${error.message}`,
        )
      }
    }

    if (nextChapters?.length > 0) {
      const cacheKeys = nextChapters.map(
        (chapter) => `chapter-images-${chapter}-${quality}`,
      )

      const cachedImagesPromises = cacheKeys.map((cacheKey) =>
        this.cacheManager.get<string[]>(cacheKey),
      )

      const cachedImages = await Promise.all(cachedImagesPromises)

      try {
        for (let i = 0; i < nextChapters.length; i++) {
          if (!cachedImages[i]) {
            const nextChapterImages = await this.fetchChapterImages(
              nextChapters[i],
              quality,
            )
            await this.cacheManager.set(cacheKeys[i], nextChapterImages)
          }
        }
      } catch (error) {
        throw new InternalServerErrorException(
          `Failed to fetch next chapter images: ${error.message}`,
        )
      }
    }

    return imageUrls
  }

  private async fetchChapterImages(
    chapterId: string,
    quality: string,
  ): Promise<string[]> {
    try {
      const response = await axiosInstance.get(
        MANGADEX_API + `/at-home/server/${chapterId}`,
      )
      const { baseUrl, chapter } = response.data

      if (!baseUrl || !chapter || !chapter.hash || !chapter[quality]) {
        throw new NotFoundException('Invalid chapter data')
      }

      return chapter[quality].map(
        (filename: string) =>
          `${baseUrl}/${quality === 'data' ? 'data' : 'data-saver'}/${chapter.hash}/${filename}`,
      )
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch chapter images: ${error.message}`,
      )
    }
  }
}
