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
import { contentRating, MANGADEX_API } from 'src/lib/constants'
import { Chapter } from './entities/chapter.entity'
import { AuthorService } from 'src/author/author.service'
import { Alternative } from './entities/alternative.entity'

@Injectable()
export class MetadataService {
  private readonly logger = new Logger(MetadataService.name)

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(forwardRef(() => AuthorService))
    private readonly authorService: AuthorService,
  ) {}

  async getMetadata(id: string) {
    const cacheKey = `metadata:${id}`
    try {
      const cachedData = await this.cacheManager.get<Metadata>(cacheKey)
      if (cachedData) {
        this.logger.log(`Returning cached metadata for ${id}`)
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
        chapters: await this.getChapters(id),
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

  async getChapters(id: string): Promise<Chapter[]> {
    const cacheKey = `chapters:${id}`
    try {
      const cachedChapters = await this.cacheManager.get<Chapter[]>(cacheKey)
      if (cachedChapters) {
        this.logger.log(`Returning cached chapters for ${id}`)
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
