import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { axiosInstance } from 'src/lib/axios'
import { Cache } from 'cache-manager'
import { MANGADEX_API } from 'src/lib/constants'
import { SearchService } from 'src/search/search.service'
import { AuthorInfo } from './entities/AuthorInfo.entity'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { AuthorSearch } from './entities/AuthorSearch.entity'

const LIMIT = 100
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
      throw new InternalServerErrorException(
        `Error fetching author ${id}: ${error.message}`,
      )
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
        mangas: relatedManga,
        social: {
          twitter: author.attributes.twitter,
          pixiv: author.attributes.pixiv,
          melonBook: author.attributes.melonBook,
          fanBox: author.attributes.fanBox,
          nicoVideo: author.attributes.nicoVideo,
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
      throw new InternalServerErrorException(
        `Error fetching author info for ${id}: ${error.message}`,
      )
    }
  }

  async getAuthors(page: number, name: string): Promise<AuthorSearch[]> {
    const cacheKey = name
      ? `authors:${name}-page:${page}`
      : `authors-page:${page}`
    this.logger.log(`Fetching authors for page ${page}`)

    const cachedAuthors = await this.cacheManager.get<AuthorSearch[]>(cacheKey)
    if (cachedAuthors) {
      this.logger.log(`Returning cached authors for page ${page}`)
      return cachedAuthors
    }

    try {
      const { data } = await axiosInstance.get(MANGADEX_API + '/author', {
        params: {
          limit: LIMIT,
          name: name ? name : null,
          offset: (page - 1) * LIMIT,
          order: {
            name: 'asc',
          },
        },
      })

      const { data: authors } = data

      const searchResults: AuthorSearch[] = await Promise.all(
        authors.map((info) => {
          const { attributes } = info

          const totalPage = Math.ceil(data.total / LIMIT)

          const result: AuthorSearch = {
            id: info.id,
            name: attributes.name,
            totalPage,
          }

          return result
        }),
      )

      await this.cacheManager.set(cacheKey, searchResults)
      this.logger.log(`Authors for page ${page} cached successfully`)

      return searchResults
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching authors for page ${page}: ${error.message}`,
      )
    }
  }
}
