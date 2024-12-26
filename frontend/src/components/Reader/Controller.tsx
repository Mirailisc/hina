import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

import { READER_PATH } from '@constants/routes'

type Props = {
  chapterStates: {
    mangaId: string
    current: string
    previous: string | null
    next: string | null
  }
  language: string | null
}

const Controller: React.FC<Props> = ({ chapterStates, language }: Props): JSX.Element => {
  const navigate = useNavigate()

  const handleController = async (to: string) => {
    await navigate({ pathname: to, search: language ? `?lang=${language}` : '' }, { replace: true })
  }

  if (!chapterStates.previous && !chapterStates.next) return <></>

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 m-auto md:w-[500px]">
      <div className="rounded-lg border border-white/20 bg-black/80 p-4 backdrop-blur-lg">
        <div className="flex flex-row items-center justify-between">
          {chapterStates.previous ? (
            <div
              onClick={() =>
                handleController(
                  READER_PATH.replace(':id', chapterStates.mangaId).replace(
                    ':chapterId',
                    chapterStates.previous as string,
                  ),
                )
              }
            >
              <FaArrowLeft className="text-2xl text-white/50 transition-colors duration-200 hover:text-white" />
            </div>
          ) : (
            <span />
          )}
          {chapterStates.next ? (
            <div
              onClick={() =>
                handleController(
                  READER_PATH.replace(':id', chapterStates.mangaId).replace(':chapterId', chapterStates.next as string),
                )
              }
            >
              <FaArrowRight className="text-2xl text-white/50 transition-colors duration-200 hover:text-white" />
            </div>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  )
}

export default Controller
