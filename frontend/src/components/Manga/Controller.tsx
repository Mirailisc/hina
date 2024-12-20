import { Link } from 'react-router-dom'
import { READER_PATH } from '../../constants/routes'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

type Props = {
  chapterStates: {
    mangaId: string
    current: string
    previous: string | null
    next: string | null
  }
}

const Controller: React.FC<Props> = ({ chapterStates }: Props): JSX.Element => {

  if (!chapterStates.previous && !chapterStates.next) return <></>

  return (
    <div className="fixed inset-x-4 bottom-4 m-auto md:w-[500px]">
      <div className="rounded-lg border border-white/20 bg-black/80 p-4 backdrop-blur-lg">
        <div className="flex flex-row items-center justify-between">
          {chapterStates.previous ? (
            <Link to={READER_PATH.replace(':id', chapterStates.mangaId).replace(':chapterId', chapterStates.previous)}>
              <FaArrowLeft className="text-2xl text-white/50 transition-colors duration-200 hover:text-white" />
            </Link>
          ) : (
            <span />
          )}
          {chapterStates.next ? (
            <Link to={READER_PATH.replace(':id', chapterStates.mangaId).replace(':chapterId', chapterStates.next)}>
              <FaArrowRight className="text-2xl text-white/50 transition-colors duration-200 hover:text-white" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  )
}

export default Controller
