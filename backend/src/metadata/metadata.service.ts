import { Inject, Injectable, Logger } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { axiosInstance } from 'src/lib/axios'
import { Alternative } from './entities/Alternative.entity'
import { Metadata } from './entities/metadata.entity'
import { SearchService } from 'src/search/search.service'
import { isDev } from 'src/lib/constants'

@Injectable()
export class MetadataService {
  private readonly logger = new Logger(MetadataService.name)

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly searchService: SearchService,
  ) {}

  async getMetadata(id: string) {
    const cacheKey = `metadata:${id}`
    try {
      const cachedData = await this.cacheManager.get<Metadata>(cacheKey)
      if (cachedData) {
        this.logger.log(`Returning cached metadata for ${id}`)
        return cachedData
      }

      const { data } = await axiosInstance.get(
        `https://api.mangadex.org/manga/${id}`,
      )

      const { data: metadata } = data

      const author = await this.getAuthor(
        metadata.relationships.find((rel) => rel.type === 'author').id,
      )

      const coverImageUrl = await this.searchService.getCoverImage(id)

      const result: Metadata = {
        id: metadata.id,
        title: metadata.attributes.title.en,
        alternative: {
          en:
            metadata.attributes.altTitles.find((alt) => alt['en'])?.['en'] ||
            '',
          ja:
            metadata.attributes.altTitles.find((alt) => alt['ja'])?.['ja'] ||
            '',
          romaji:
            metadata.attributes.altTitles.find((alt) => alt['ja-ro'])?.[
              'ja-ro'
            ] || '',
        } as Alternative,
        cover: coverImageUrl,
        author: author,
        status: metadata.attributes.status,
        description: metadata.attributes.description.en || '',
        chapters: await this.getChapters(id),
      }

      await this.cacheManager.set(cacheKey, result)

      this.logger.log(`Metadata for ${id} fetched and cached`)

      return result
    } catch (error) {
      this.logger.error(`Error fetching metadata for ${id}: ${error.message}`)
      throw new Error(`Unable to fetch metadata for manga ID: ${id}`)
    }
  }

  async getAuthor(id: string) {
    const cacheKey = `author:${id}`
    try {
      const cachedAuthor = await this.cacheManager.get<string>(cacheKey)
      if (cachedAuthor) {
        this.logger.log(`Returning cached author for ${id}`)
        return cachedAuthor
      }

      const { data } = await axiosInstance.get(
        `https://api.mangadex.org/author/${id}`,
      )
      const { data: author } = data

      await this.cacheManager.set(cacheKey, author.attributes.name)

      return author.attributes.name
    } catch (error) {
      this.logger.error(`Error fetching author ${id}: ${error.message}`)
      return ''
    }
  }

  async getChapters(id: string) {
    const cacheKey = `chapters:${id}`
    try {
      const cachedChapters = await this.cacheManager.get<string[]>(cacheKey)
      if (cachedChapters) {
        this.logger.log(`Returning cached chapters for ${id}`)
        return cachedChapters
      }

      const allChapterIds: string[] = []
      let currentPage = 1
      let totalChapters = 0
      const chaptersPerPage = 10

      do {
        const { data } = await axiosInstance.get(
          'https://api.mangadex.org/chapter',
          {
            params: {
              manga: id,
              contentRating: [isDev ? 'safe' : 'pornographic'],
              translatedLanguage: ['en'],
              includeFutureUpdates: 1,
              order: {
                createdAt: 'asc',
                updatedAt: 'asc',
                publishAt: 'asc',
                readableAt: 'asc',
                volume: 'asc',
                chapter: 'asc',
              },
              limit: chaptersPerPage,
              offset: (currentPage - 1) * chaptersPerPage,
            },
          },
        )

        const chapterIds = data.data.map(
          (chapter: { id: string }) => chapter.id,
        )
        allChapterIds.push(...chapterIds)

        totalChapters = data.total
        currentPage++
      } while (allChapterIds.length < totalChapters)

      await this.cacheManager.set(cacheKey, allChapterIds)

      return allChapterIds
    } catch (error) {
      this.logger.error(`Error fetching chapters for ${id}: ${error.message}`)
      return []
    }
  }
}
