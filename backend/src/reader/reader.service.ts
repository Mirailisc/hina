import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { Inject } from '@nestjs/common'
import axios from 'axios'
import { Cache } from 'cache-manager'
import { axiosInstance } from 'src/lib/axios'
import { MANGADEX_API } from 'src/lib/constants'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ReaderService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prisma: PrismaService,
  ) {}

  async fetchImage(imageUrl: string): Promise<string> {
    const imageCacheKey = `image-${imageUrl}`

    const cachedImage = await this.cacheManager.get<string>(imageCacheKey)
    if (cachedImage) {
      return cachedImage
    }

    const image = await this.prisma.images.findUnique({
      where: { key: imageCacheKey },
    })

    if (image) {
      return image.data
    }

    try {
      const response = await axios.get(imageUrl, {
        headers: {
          referer: 'https://mangadex.org/',
          origin: 'https://mangadex.org/',
          'user-agent':
            'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
          accept: '*/*',
        },
        responseType: 'arraybuffer',
      })

      if (response.status === HttpStatus.OK) {
        const imageBuffer = Buffer.from(response.data, 'binary')
        const imageUrlData = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`

        await this.prisma.images.create({
          data: {
            key: imageCacheKey,
            data: imageUrlData,
          },
        })
        await this.cacheManager.set(imageCacheKey, imageUrlData)
        return imageUrlData
      } else {
        throw new NotFoundException(
          'Failed to fetch image: ' + response.statusText,
        )
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch image: ${error.message}`,
      )
    }
  }

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
