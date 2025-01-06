import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { MetadataService } from 'src/metadata/metadata.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { BookmarkedManga } from './entities/bookmarked-manga'
import { Bookmark } from './entities/bookmark.entity'

@Injectable()
export class BookmarkService {
  private readonly logger: Logger = new Logger(BookmarkService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly metadataService: MetadataService,
  ) {}

  async createBookmark(username: string, mangaId: string) {
    try {
      const allChapters = await this.metadataService.getChapters(mangaId, '')

      await this.prisma.bookmark.create({
        data: {
          username,
          mangaId,
          currentChapter: allChapters[0].chapter,
          currentLanguage: '',
        },
      })

      this.logger.log(
        `Bookmark created for user ${username} and manga ${mangaId}`,
      )

      return 'Successfully created bookmark'
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getBookmarks(username: string): Promise<Bookmark[]> {
    try {
      const bookmarks = await this.prisma.bookmark.findMany({
        where: { username },
      })

      const result = await Promise.all(
        bookmarks.map(async (bookmark) => {
          const { id, title, status, cover } =
            await this.metadataService.getMetadata(bookmark.mangaId, '')

          return {
            id: bookmark.id,
            manga: { id, title, status, cover } as BookmarkedManga,
            currentChapter: bookmark.currentChapter,
            currentLanguage: bookmark.currentLanguage,
          }
        }),
      )

      return result
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getBookmark(username: string, mangaId: string) {
    try {
      const bookmark = await this.prisma.bookmark.findFirst({
        where: { username, mangaId },
      })

      if (!bookmark) {
        return {
          id: '',
          manga: {
            id: '',
            title: '',
            status: '',
            cover: '',
          } as BookmarkedManga,
          currentChapter: '',
          currentLanguage: '',
        }
      }

      const { id, title, status, cover } =
        await this.metadataService.getMetadata(bookmark.mangaId, '')

      return {
        id: bookmark.id,
        manga: { id, title, status, cover } as BookmarkedManga,
        currentChapter: bookmark.currentChapter,
        currentLanguage: bookmark.currentLanguage,
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async updateBookmark(
    bookmarkId: string,
    currentChapter: string,
    currentLanguage: string,
  ) {
    try {
      const result = await this.prisma.bookmark.update({
        where: { id: bookmarkId },
        data: { currentChapter, currentLanguage },
      })

      this.logger.log(
        `Bookmark updated for user ${result.username} and manga ${result.mangaId}`,
      )

      return 'Successfully updated bookmark'
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async deleteBookmark(bookmarkId: string) {
    try {
      const result = await this.prisma.bookmark.delete({
        where: { id: bookmarkId },
      })

      this.logger.log(
        `Bookmark deleted for user ${result.username} and manga ${result.mangaId}`,
      )

      return 'Successfully deleted bookmark'
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
