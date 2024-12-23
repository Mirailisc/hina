import { Injectable, Inject, Logger, forwardRef } from '@nestjs/common'
import { MangaSearch } from './entities/MangaSearch.entity'
import { axiosInstance } from 'src/lib/axios'
import { Cache } from 'cache-manager'
import { MetadataService } from 'src/metadata/metadata.service'
import { contentRating, MANGADEX_API } from 'src/lib/constants'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { InternalServerErrorException } from '@nestjs/common'

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name)

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(forwardRef(() => MetadataService))
    private readonly metadataService: MetadataService,
  ) {}

  async search(
    name: string,
    limit: number,
    page: number,
  ): Promise<MangaSearch[]> {
    const cacheKey = `search:${name}:limit:${limit}:page:${page}`
    const lowercaseName = name.toLowerCase()

    try {
      const cachedResults = await this.cacheManager.get(cacheKey)
      if (cachedResults) {
        return cachedResults as MangaSearch[]
      }

      const { data } = await this.fetch({
        limit,
        title: lowercaseName,
        offset: (page - 1) * limit,
        contentRating,
        'order[latestUploadedChapter]': 'desc',
      })

      const { data: searchResult } = data

      const searchResults: MangaSearch[] = await Promise.all(
        searchResult.map(async (info) => {
          const { attributes } = info

          const coverImageUrl = await this.metadataService.getCoverImage(
            info.id,
          )

          const totalPage = Math.ceil(data.total / limit)

          const result = {
            id: info.id,
            title: attributes.title.en || 'Untitled',
            status: attributes.status,
            cover: coverImageUrl,
            totalPage,
          }

          return result
        }),
      )

      await this.cacheManager.set(cacheKey, searchResults)

      this.logger.log(`Search for ${name} got ${searchResults.length} results`)

      return searchResults
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching search results for ${name}: ${error.message}`,
      )
    }
  }

  async searchByTag(
    includedTags: string[],
    excludedTags: string[],
    limit: number,
    page: number,
  ): Promise<MangaSearch[]> {
    try {
      const { data } = await this.fetch({
        limit,
        offset: (page - 1) * limit,
        includedTags,
        excludedTags,
        includedTagsMode: 'AND',
        excludedTagsMode: 'OR',
        contentRating,
        'order[latestUploadedChapter]': 'desc',
      })

      const { data: searchResult } = data

      const searchResults: MangaSearch[] = await Promise.all(
        searchResult.map(async (info) => {
          const { attributes } = info

          const coverImageUrl = await this.metadataService.getCoverImage(
            info.id,
          )

          const totalPage = Math.ceil(data.total / limit)

          const result = {
            id: info.id,
            title: attributes.title.en || 'Untitled',
            status: attributes.status,
            cover: coverImageUrl,
            totalPage,
          }

          return result
        }),
      )

      this.logger.log(`Search for tags got ${searchResults.length} results`)

      return searchResults
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching search results by tag: ${error.message}`,
      )
    }
  }

  async searchByAuthor(
    authorId: string,
    limit: number,
    page: number,
  ): Promise<MangaSearch[]> {
    const cacheKey = `searchByAuthor:${authorId}:limit:${limit}:page:${page}`

    try {
      const cachedResults = await this.cacheManager.get<MangaSearch[]>(cacheKey)
      if (cachedResults) {
        return cachedResults
      }

      const { data } = await this.fetch({
        limit,
        offset: (page - 1) * limit,
        authorOrArtist: authorId,
        contentRating,
        'order[latestUploadedChapter]': 'desc',
      })

      const { data: searchResult } = data

      const searchResults: MangaSearch[] = await Promise.all(
        searchResult.map(async (info) => {
          const { attributes } = info

          const coverImageUrl = await this.metadataService.getCoverImage(
            info.id,
          )

          const totalPage = Math.ceil(data.total / limit)

          const result = {
            id: info.id,
            title: attributes.title.en || 'Untitled',
            status: attributes.status,
            cover: coverImageUrl,
            totalPage,
          }

          return result
        }),
      )

      await this.cacheManager.set(cacheKey, searchResults)

      this.logger.log(
        `Search by author ${authorId} got ${searchResults.length} results`,
      )

      return searchResults
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching search results by author ${authorId}: ${error.message}`,
      )
    }
  }

  private async fetch(params: any) {
    return await axiosInstance.get(MANGADEX_API + '/manga', {
      params,
    })
  }
}
