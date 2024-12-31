import {
  Injectable,
  InternalServerErrorException,
  Logger,
  Inject,
} from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { axiosInstance } from 'src/lib/axios'
import { MANGADEX_API } from 'src/lib/constants'
import { Tags } from './entities/tags.entity'
import { SearchService } from 'src/search/search.service'
import { MangaSearch } from 'src/search/entities/MangaSearch.entity'

const MANGA_LIMIT = 60

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name)
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly searchService: SearchService,
  ) {}

  async getTags(): Promise<Tags[]> {
    const cacheKey = 'tags'

    try {
      const cachedTags = await this.cacheManager.get<Tags[]>(cacheKey)
      if (cachedTags) {
        this.logger.log('Tags retrieved from cache')
        return cachedTags
      }

      const { data } = await axiosInstance.get(MANGADEX_API + '/manga/tag')
      const { data: tags } = data

      const result = tags.map((info) => {
        const { attributes } = info
        return {
          id: info.id,
          name: attributes.name.en,
        }
      })

      await this.cacheManager.set(cacheKey, result)
      this.logger.log('Tags cached successfully')

      return result
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching tags: ${error.message}`,
      )
    }
  }

  async getMangaByTags(
    includedTagId: string[],
    page: number,
  ): Promise<MangaSearch[]> {
    return await this.searchService.searchByTag(
      includedTagId,
      MANGA_LIMIT,
      page,
    )
  }
}
