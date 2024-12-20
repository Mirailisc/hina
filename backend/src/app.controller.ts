import { Controller, Get, NotFoundException, Res } from '@nestjs/common'
import { AppService } from './app.service'
import { Response } from 'express'
import { join } from 'path'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealth(): { status: string } {
    return this.appService.getHealth()
  }

  @Get('*')
  serveReactApp(@Res() res: Response) {
    if (process.env.NODE_ENV === 'production') {
      res.sendFile(join(__dirname, '..', 'public', 'index.html'))
    } else {
      throw new NotFoundException('Not found')
    }
  }
}
