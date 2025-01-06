import { Link } from 'react-router-dom'

import { MANGA_PATH } from '@constants/routes'

import ThumbnailImage from './Image'

export interface IMangaSearch {
  id: string
  title: string
  status: string
  cover: string
  totalPage: number
}

type Props = {
  data: IMangaSearch
}

const Thumbnail: React.FC<Props> = ({ data }: Props): JSX.Element => {
  return (
    <Link
      className="w-[180px] rounded-lg bg-secondary-900/30 transition-transform hover:scale-105 sm:w-[200px]"
      to={MANGA_PATH.replace(':id', data.id)}
    >
      <div>
        <ThumbnailImage image={data.cover} />
        <div className="p-2">
          <div className="sm:text-md text-sm font-bold text-white">{data.title}</div>
        </div>
      </div>
    </Link>
  )
}

export default Thumbnail
