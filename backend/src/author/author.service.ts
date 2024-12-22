import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { Author } from './entities/author.entity'
import { axiosInstance } from 'src/lib/axios'
import { Cache } from 'cache-manager'
import { MANGADEX_API } from 'src/lib/constants'
import { SearchService } from 'src/search/search.service'
import { AuthorInfo } from './entities/author-info.entity'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

const LIMIT = 60
const MANGA_LIMIT = 12

@Injectable()
export class AuthorService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(forwardRef(() => SearchService))
    private readonly searchService: SearchService,
  ) {}

  private readonly logger = new Logger(AuthorService.name)

  async getAuthorName(id: string): Promise<{
    id: string
    name: string
  }> {
    const cacheKey = `author:${id}`
    try {
      const cachedAuthor = await this.cacheManager.get<{
        id: string
        name: string
      }>(cacheKey)
      if (cachedAuthor) {
        this.logger.log(`Returning cached author for ${id}`)
        return cachedAuthor
      }

      const { data } = await axiosInstance.get(`${MANGADEX_API}/author/${id}`)
      const { data: author } = data

      const result = {
        id: author.id,
        name: author.attributes.name,
      }

      await this.cacheManager.set(cacheKey, result)
      return result
    } catch (error) {
      this.logger.error(`Error fetching author ${id}: ${error.message}`)
      return {
        id,
        name: '',
      }
    }
  }

  async getAuthorInfo(id: string, mangaPage: number): Promise<AuthorInfo> {
    const cacheKey = `author-info:${id}`
    this.logger.log(`Fetching author info for ${id} on manga page ${mangaPage}`)

    const cachedAuthor = await this.cacheManager.get<AuthorInfo>(cacheKey)
    if (cachedAuthor) {
      this.logger.log(`Returning cached author info for ${id}`)
      return cachedAuthor
    }

    try {
      const { data } = await axiosInstance.get(`${MANGADEX_API}/author/${id}`)
      const { data: author } = data
      const relatedManga = await this.searchService.searchByAuthor(
        id,
        MANGA_LIMIT,
        mangaPage,
      )

      const authorInfo: AuthorInfo = {
        id: author.id,
        name: author.attributes.name,
        imageUrl: author.attributes.imageUrl,
        mangas: relatedManga,
        social: {
          twitter: author.attributes.twitter,
          pixiv: author.attributes.pixiv,
          melonBook: author.attributes.melonbook,
          fanBox: author.attributes.fanbox,
          nicoVideo: author.attributes.nicovideo,
          fantia: author.attributes.fantia,
          tumblr: author.attributes.tumblr,
          youtube: author.attributes.youtube,
          weibo: author.attributes.weibo,
          website: author.attributes.website,
        },
      }

      await this.cacheManager.set(cacheKey, authorInfo)
      this.logger.log(`Author info for ${id} cached successfully`)

      return authorInfo
    } catch (error) {
      this.logger.error(
        `Error fetching author info for ${id}: ${error.message}`,
      )
      return null
    }
  }

  async getAuthors(page: number): Promise<Author[]> {
    const cacheKey = `authors:page:${page}`
    this.logger.log(`Fetching authors for page ${page}`)

    const cachedAuthors = await this.cacheManager.get<Author[]>(cacheKey)
    if (cachedAuthors) {
      this.logger.log(`Returning cached authors for page ${page}`)
      return cachedAuthors
    }

    try {
      const { data } = await axiosInstance.get(MANGADEX_API + '/author', {
        params: {
          limit: LIMIT,
          offset: (page - 1) * LIMIT,
          order: {
            name: 'asc',
          },
        },
      })

      const { data: authors } = data
      this.logger.log(
        `Received ${authors.length} authors from API for page ${page}`,
      )

      const searchResults: Author[] = await Promise.all(
        authors.map((info) => {
          const { attributes } = info

          const result: Author = {
            id: info.id,
            name: attributes.name,
          }

          return result
        }),
      )

      await this.cacheManager.set(cacheKey, searchResults)
      this.logger.log(`Authors for page ${page} cached successfully`)

      return searchResults
    } catch (error) {
      this.logger.error(
        `Error fetching authors for page ${page}: ${error.message}`,
      )
      return []
    }
  }
}
