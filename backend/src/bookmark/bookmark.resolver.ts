import { Query, Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { Bookmark } from './entities/bookmark.entity'
import { AuthGuard } from 'src/auth/auth.guard'
import { CreateBookmarkInput } from './dto/create-bookmark.input'
import { BookmarkService } from './bookmark.service'

@Resolver(() => Bookmark)
export class BookmarkResolver {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @UseGuards(AuthGuard)
  @Query(() => [Bookmark])
  async getBookmarks(@Context() ctx: any): Promise<Bookmark[]> {
    const user = ctx.req.user
    return this.bookmarkService.getBookmarks(user.username)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async createBookmark(
    @Args('input') input: CreateBookmarkInput,
    @Context() ctx: any,
  ): Promise<string> {
    const user = ctx.req.user
    return this.bookmarkService.createBookmark(
      user?.username || '',
      input.mangaId,
    )
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async updateBookmark(
    @Args('bookmarkId') bookmarkId: string,
    @Args('currentChapter') currentChapter: string,
  ): Promise<string> {
    return this.bookmarkService.updateBookmark(bookmarkId, currentChapter)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async deleteBookmark(
    @Args('bookmarkId') bookmarkId: string,
  ): Promise<string> {
    return this.bookmarkService.deleteBookmark(bookmarkId)
  }
}
