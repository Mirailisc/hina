import { Injectable, Inject, Logger, forwardRef } from '@nestjs/common'
import { MangaSearch } from './entities/MangaSearch.entity'
import { axiosInstance } from 'src/lib/axios'
import { Cache } from 'cache-manager'
import { MetadataService } from 'src/metadata/metadata.service'
import { contentRating, MANGADEX_API } from 'src/lib/constants'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name)

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(forwardRef(() => MetadataService))
    private readonly metadataService: MetadataService,
  ) {}

  async search(name: string, limit: number): Promise<MangaSearch[]> {
    const lowercaseName = name.toLowerCase()

    const cachedResults = await this.cacheManager.get(lowercaseName)
    if (cachedResults) {
      return cachedResults as MangaSearch[]
    }

    const { data } = await this.fetch({
      limit,
      title: lowercaseName,
      contentRating,
      'order[latestUploadedChapter]': 'desc',
    })

    const { data: searchResult } = data

    const searchResults: MangaSearch[] = await Promise.all(
      searchResult.map(async (info) => {
        const { attributes } = info

        const coverImageUrl = await this.metadataService.getCoverImage(info.id)

        const result = {
          id: info.id,
          title: attributes.title.en || 'Untitled',
          status: attributes.status,
          cover: coverImageUrl,
        }

        return result
      }),
    )

    await this.cacheManager.set(lowercaseName, searchResults)

    this.logger.log(`Search for ${name} got ${searchResults.length} results`)

    return searchResults
  }

  async searchByTag(
    includedTags: string[],
    excludedTags: string[],
    limit: number,
    page: number,
  ): Promise<MangaSearch[]> {
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

        const coverImageUrl = await this.metadataService.getCoverImage(info.id)

        const result = {
          id: info.id,
          title: attributes.title.en || 'Untitled',
          status: attributes.status,
          cover: coverImageUrl,
        }

        return result
      }),
    )

    this.logger.log(`Search for tags got ${searchResults.length} results`)

    return searchResults
  }

  async searchByAuthor(
    authorId: string,
    limit: number,
    page: number,
  ): Promise<MangaSearch[]> {
    const cacheKey = `searchByAuthor:${authorId}:limit:${limit}:page:${page}`

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

        const coverImageUrl = await this.metadataService.getCoverImage(info.id)

        const result = {
          id: info.id,
          title: attributes.title.en || 'Untitled',
          status: attributes.status,
          cover: coverImageUrl,
        }

        return result
      }),
    )

    await this.cacheManager.set(cacheKey, searchResults)

    this.logger.log(
      `Search by author ${authorId} got ${searchResults.length} results`,
    )

    return searchResults
  }

  private async fetch(params: any) {
    return await axiosInstance.get(MANGADEX_API + '/manga', {
      params,
    })
  }
}
