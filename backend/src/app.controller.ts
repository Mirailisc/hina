import { Controller, Get, NotFoundException, Res } from '@nestjs/common'
import { AppService } from './app.service'
import { isDev } from './lib/constants'
import { join } from 'path'
import { Response } from 'express'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealth(): { status: string } {
    return this.appService.getHealth()
  }

  @Get('*')
  serveReactApp(@Res() res: Response) {
    if (isDev) {
      throw new NotFoundException('Not found')
    } else {
      res.sendFile(join(__dirname, '..', 'public', 'index.html'))
    }
  }
}
