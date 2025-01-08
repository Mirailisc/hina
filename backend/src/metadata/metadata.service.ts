import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { axiosInstance } from 'src/lib/axios'
import { Metadata } from './entities/metadata.entity'
import { Chapter } from './entities/chapter.entity'
import { AuthorService } from 'src/author/author.service'
import { Alternative } from './entities/Alternative.entity'
import { contentRating, MANGADEX_API } from 'src/constants/constants'

@Injectable()
export class MetadataService {
  private readonly logger = new Logger(MetadataService.name)

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(forwardRef(() => AuthorService))
    private readonly authorService: AuthorService,
  ) {}

  async getMetadata(id: string, language: string | null) {
    const cacheKey = `metadata:${id}-${language === '' ? 'all' : language}`
    try {
      const cachedData = await this.cacheManager.get<Metadata>(cacheKey)
      if (cachedData) {
        this.logger.log(
          `Returning cached metadata for ${id} and language ${language === '' ? 'all' : language}`,
        )
        return cachedData
      }

      const { data } = await axiosInstance.get(`${MANGADEX_API}/manga/${id}`)

      const { data: metadata } = data

      const author = await this.authorService.getAuthorName(
        metadata.relationships.find((rel) => rel.type === 'author').id,
      )

      const coverImageUrl = await this.getCoverImage(id)

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
        author: {
          id: author.id,
          name: author.name,
        },
        status: metadata.attributes.status,
        description: metadata.attributes.description.en || '',
        chapters: await this.getChapters(id, language),
      }

      await this.cacheManager.set(cacheKey, result)

      this.logger.log(`Metadata for ${id} fetched and cached`)

      return result
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching metadata for ${id}: ${error.message}`,
      )
    }
  }

  async getBulkMetadata(
    ids: string[],
    language: string | null,
  ): Promise<Metadata[]> {
    const cacheKey = `bulk-metadata:${ids.sort().join(',')}-${language || 'all'}`

    try {
      const cachedData = await this.cacheManager.get<Metadata[]>(cacheKey)
      if (cachedData) {
        this.logger.log(
          `Returning cached bulk metadata for IDs: ${ids.join(', ')}`,
        )
        return cachedData
      }

      const metadataPromises = ids.map((id) => this.getMetadata(id, language))
      const metadataResults = await Promise.all(metadataPromises)

      await this.cacheManager.set(cacheKey, metadataResults)

      this.logger.log(`Cached bulk metadata for IDs: ${ids.join(', ')}`)

      return metadataResults
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching bulk metadata for IDs: ${ids.join(', ')} - ${error.message}`,
      )
    }
  }

  async getChapters(id: string, language: string): Promise<Chapter[]> {
    const cacheKey = `chapters:${id}-${language === '' ? 'all' : language}`
    try {
      const cachedChapters = await this.cacheManager.get<Chapter[]>(cacheKey)
      if (cachedChapters) {
        this.logger.log(
          `Returning cached chapters for ${id} and language ${language === '' ? 'all' : language}`,
        )
        return cachedChapters
      }

      const allChapterIds: Chapter[] = []
      let currentPage = 1
      let totalChapters = 0
      const chaptersPerPage = 10

      do {
        const { data } = await axiosInstance.get(MANGADEX_API + '/chapter', {
          params: {
            manga: id,
            contentRating,
            includeFutureUpdates: 1,
            translatedLanguage: language ? [language] : undefined,
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
        })

        const { data: chapters } = data

        const chapterIds = chapters.map((chapter, index) => {
          return {
            id: chapter.id,
            chapter: chapter.attributes.chapter ?? (index + 1).toString(),
            volume: chapter.attributes.volume,
            title: chapter.attributes.title,
            translatedLanguage: chapter.attributes.translatedLanguage,
            publishAt: chapter.attributes.publishAt,
          }
        })

        allChapterIds.push(...chapterIds)

        totalChapters = data.total
        currentPage++
      } while (allChapterIds.length < totalChapters)

      await this.cacheManager.set(cacheKey, allChapterIds)

      return allChapterIds
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching chapters for manga ${id}: ${error.message}`,
      )
    }
  }

  async getCoverImage(id: string): Promise<string | null> {
    try {
      const { data } = await axiosInstance.get(MANGADEX_API + '/cover', {
        params: {
          manga: [id],
        },
      })

      const cover = data.data.find((item) => item.type === 'cover_art')

      if (cover) {
        const fileName = cover.attributes.fileName
        if (fileName) {
          return `https://uploads.mangadex.org/covers/${id}/${fileName}.256.jpg`
        }
      } else {
        return null
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching cover for manga ${id}: ${error.message}`,
      )
    }
  }
}
