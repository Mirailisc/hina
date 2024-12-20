import { Link } from 'react-router-dom'
import { MANGA_PATH } from '../../constants/routes'

export interface IMangaSearch {
  id: string
  title: string
  status: string
  cover: string
}

type Props = {
  data: IMangaSearch
}

const MangaCard: React.FC<Props> = ({ data }: Props): JSX.Element => {
  return (
    <Link className="w-[150px] rounded-lg border border-white/20 sm:w-[200px]" to={MANGA_PATH.replace(':id', data.id)}>
      <div>
        <img
          src={data.cover}
          alt="image"
          className="pointer-events-none h-[220px] w-full select-none rounded-t-lg sm:h-[270px]"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="p-2">
          <div className="sm:text-md text-sm font-bold text-white">{data.title}</div>
        </div>
      </div>
    </Link>
  )
}

export default MangaCard
