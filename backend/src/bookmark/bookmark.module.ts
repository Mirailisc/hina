import { forwardRef, Module } from '@nestjs/common'
import { BookmarkService } from './bookmark.service'
import { BookmarkResolver } from './bookmark.resolver'
import { PrismaService } from 'src/prisma/prisma.service'
import { MetadataModule } from 'src/metadata/metadata.module'
import { AuthService } from 'src/auth/auth.service'
import { UserService } from 'src/user/user.service'

@Module({
  imports: [forwardRef(() => MetadataModule)],
  providers: [
    BookmarkService,
    BookmarkResolver,
    PrismaService,
    AuthService,
    UserService,
  ],
})
export class BookmarkModule {}
