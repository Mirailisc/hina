import { FaHome, FaList } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { BASE_PATH, MANGA_PATH } from '../../constants/routes'

type Props = {
  mangaId: string
  totalChapters: number
  currentChapter: number
}

const Titlebar: React.FC<Props> = ({ totalChapters, mangaId, currentChapter }: Props): JSX.Element => {
  return (
    <div className="fixed inset-x-4 top-4 m-auto md:w-[500px]">
      <div className="rounded-lg border border-white/20 bg-black/80 p-4 backdrop-blur-lg">
        <div className="flex flex-row items-center justify-between">
          <Link to={BASE_PATH}>
            <FaHome className="size-[24px] text-white/50 transition-colors duration-200 hover:text-white" />
          </Link>
          <Link to={MANGA_PATH.replace(':id', mangaId)}>
            <FaList className="size-[24px] text-white/50 transition-colors duration-200 hover:text-white" />
          </Link>
          <div className="text-white/50">
            {currentChapter + 1}/{totalChapters}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Titlebar
