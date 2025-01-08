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
      const firstChapter = allChapters?.[0]?.chapter || '1'

      await this.prisma.bookmark.create({
        data: {
          username,
          mangaId,
          currentChapter: firstChapter,
          currentLanguage: '',
        },
      })

      this.logger.log(
        `Bookmark created for user ${username} and manga ${mangaId}`,
      )

      return 'Successfully created bookmark'
    } catch (error) {
      this.logger.error(
        `Failed to create bookmark for user ${username} and manga ${mangaId}: ${error.message}`,
      )
      throw new InternalServerErrorException('Error creating bookmark')
    }
  }

  async getBookmarks(username: string): Promise<Bookmark[]> {
    try {
      const bookmarks = await this.prisma.bookmark.findMany({
        where: { username },
        select: {
          id: true,
          mangaId: true,
          currentChapter: true,
          currentLanguage: true,
        },
      })

      if (bookmarks.length === 0) {
        return []
      }

      const mangaIds = bookmarks.map((b) => b.mangaId)
      const metadata = await this.metadataService.getBulkMetadata(mangaIds, '')

      const metadataMap = metadata.reduce(
        (acc, { id, title, status, cover }) => {
          acc[id] = { id, title, status, cover }
          return acc
        },
        {} as Record<string, BookmarkedManga>,
      )

      return bookmarks.map((bookmark) => ({
        id: bookmark.id,
        manga: metadataMap[bookmark.mangaId] || {
          id: bookmark.mangaId,
          title: 'Unknown',
          status: 'Unknown',
          cover: '',
        },
        currentChapter: bookmark.currentChapter,
        currentLanguage: bookmark.currentLanguage,
      }))
    } catch (error) {
      this.logger.error(
        `Failed to fetch bookmarks for user ${username}: ${error.message}`,
      )
      throw new InternalServerErrorException('Error fetching bookmarks')
    }
  }

  async getBookmark(username: string, mangaId: string) {
    try {
      // Fetch bookmark
      const bookmark = await this.prisma.bookmark.findFirst({
        where: { username, mangaId },
        select: { id: true, currentChapter: true, currentLanguage: true },
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
        (await this.metadataService.getMetadata(mangaId, '')) || {}

      return {
        id: bookmark.id,
        manga: { id, title, status, cover } as BookmarkedManga,
        currentChapter: bookmark.currentChapter,
        currentLanguage: bookmark.currentLanguage,
      }
    } catch (error) {
      this.logger.error(
        `Failed to fetch bookmark for user ${username} and manga ${mangaId}: ${error.message}`,
      )
      throw new InternalServerErrorException('Error fetching bookmark')
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
      this.logger.error(
        `Failed to update bookmark ${bookmarkId}: ${error.message}`,
      )
      throw new InternalServerErrorException('Error updating bookmark')
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
      this.logger.error(
        `Failed to delete bookmark ${bookmarkId}: ${error.message}`,
      )
      throw new InternalServerErrorException('Error deleting bookmark')
    }
  }
}
