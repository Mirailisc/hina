import { Injectable, Inject, Logger } from '@nestjs/common'
import { MangaSearch } from './entities/MangaSearch.entity'
import { axiosInstance } from 'src/lib/axios'
import { Cache } from 'cache-manager'
import { isDev } from 'src/lib/constants'

interface FetchResult {
  id: string
  attributes: {
    title: {
      en: string
    }
    altTitles: {
      [key: string]: string
    }[]
    status: string
    description: {
      en: string
    }
  }
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name)

  constructor(@Inject('CACHE_MANAGER') private cacheManager: Cache) {}

  async search(name: string, limit: number): Promise<MangaSearch[]> {
    const lowercaseName = name.toLowerCase()

    const cachedResults = await this.cacheManager.get(lowercaseName)
    if (cachedResults) {
      return cachedResults as MangaSearch[]
    }

    const { data } = await axiosInstance.get('https://api.mangadex.org/manga', {
      params: {
        limit,
        title: lowercaseName,
        includedTagsMode: 'AND',
        excludedTagsMode: 'OR',
        'contentRating[]': [isDev ? 'safe' : 'pornographic'],
        'order[latestUploadedChapter]': 'desc',
      },
    })

    const { data: searchResult } = data

    const searchResults: MangaSearch[] = await Promise.all(
      searchResult.map(async (info: FetchResult) => {
        const { attributes } = info
        if (!info.id) {
          throw new Error('Missing ID in search result')
        }

        const coverImageUrl = await this.getCoverImage(info.id)

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

  async getCoverImage(id: string): Promise<string | null> {
    try {
      const { data } = await axiosInstance.get(
        `https://api.mangadex.org/cover`,
        {
          params: {
            manga: [id],
          },
        },
      )

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
      this.logger.error(
        `Error fetching cover for manga ${id}: ${error.message}`,
      )
      return null
    }
  }
}
