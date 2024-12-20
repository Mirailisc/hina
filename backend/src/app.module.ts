import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SearchModule } from './search/search.module'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
// import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { CacheModule } from '@nestjs/cache-manager'
import { MetadataModule } from './metadata/metadata.module'
import { ReaderModule } from './reader/reader.module'
import * as redisStore from 'cache-manager-ioredis'
import { SentryModule } from '@sentry/nestjs/setup'

const REDIS_PORT = 6379
const TTL = 3600

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SentryModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [],
      autoSchemaFile: 'schema.gql',
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: TTL,
      store: redisStore,
      host: process.env.REDIS_HOST ?? 'localhost',
      port: process.env.REDIS_PORT ?? REDIS_PORT,
    }),
    SearchModule,
    ReaderModule,
    MetadataModule,
  ].filter(Boolean),
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
