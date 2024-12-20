import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import './instrument'

const PORT = 4000

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors({
    origin: [process.env.URL ?? 'http://localhost:3000'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
      'Content-Type',
      'Baggage',
      'sentry-trace',
    ],
    credentials: true,
  })

  await app.listen(process.env.PORT ?? PORT)
}
bootstrap()
