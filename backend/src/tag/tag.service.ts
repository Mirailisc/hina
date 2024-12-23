import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { axiosInstance } from 'src/lib/axios'
import { MANGADEX_API } from 'src/lib/constants'
import { Tags } from './entities/tags.entity'

@Injectable()
export class TagService {
  async getTags(): Promise<Tags[]> {
    try {
      const { data } = await axiosInstance.get(MANGADEX_API + '/manga/tag')

      const { data: tags } = data

      const result = await Promise.all(
        tags.map((info) => {
          const { attributes } = info

          const result = {
            id: info.id,
            name: attributes.name.en,
          }

          return result
        }),
      )

      return result
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching tags: ${error.message}`,
      )
    }
  }
}
