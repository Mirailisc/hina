import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { FaRegClock } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'

import moment from 'moment'

import { getLanguageName, isoCodeToFlagEmoji } from '@/lib/lang-iso'

import { useAuth } from '@/context/authContext'

import { READER_PATH } from '@/constants/routes'

import { GET_BOOKMARK } from '@/gql/bookmark'

import { useQuery } from '@apollo/client'

import { IChapter } from './Info'

type Props = {
  id: string
  chapters: IChapter[]
  selectedLanguage: string
}

const MangaChapters: React.FC<Props> = ({ id, chapters, selectedLanguage }: Props): JSX.Element => {
  const { auth } = useAuth()
  const isAuthenticated = auth !== null

  const { data, loading, error, refetch } = useQuery(GET_BOOKMARK, {
    variables: { mangaId: id },
    skip: !isAuthenticated,
  })
  const searchParams = `${selectedLanguage === 'All' ? '' : `?lang=${selectedLanguage}`}${
    data?.getBookmark.id ? `&bookmark=${data.getBookmark.id}` : ''
  }`

  const location = useLocation()

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  useEffect(() => {
    if (isAuthenticated) {
      refetch({ mangaId: id })
    }
  }, [location.pathname, isAuthenticated, id, refetch])

  if (loading) return <></>

  const uniqueChapters = Array.from(
    new Map(
      chapters
        .filter((chapter) => getLanguageName(chapter.translatedLanguage) !== 'Unknown')
        .map((chapter) => [`${chapter.chapter}-${chapter.translatedLanguage}`, chapter]),
    ).values(),
  )

  return (
    <div className="space-y-4">
      {uniqueChapters
        .filter((chapter) => getLanguageName(chapter.translatedLanguage) !== 'Unknown')
        .map((chapter, index) => {
          return (
            <Link
              to={{
                pathname: READER_PATH.replace(':id', id).replace(':chapterId', chapter.id),
                search: searchParams,
              }}
              key={`chapter-${chapter.chapter}-${index}-${chapter.translatedLanguage}`}
            >
              <div
                className={`my-4 ${
                  chapter.chapter === data?.getBookmark.currentChapter &&
                  chapter.translatedLanguage === data?.getBookmark.currentLanguage &&
                  'border-l-8 border-primary-500'
                } bg-white/10 p-4 shadow-md transition-all duration-300 ease-in-out hover:bg-white/20`}
              >
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-white">
                      <span dangerouslySetInnerHTML={{ __html: isoCodeToFlagEmoji(chapter.translatedLanguage) }} />
                      <span className="font-semibold">
                        {chapter.volume ? `Vol. ${chapter.volume} ` : ''}Ch. {chapter.chapter}{' '}
                      </span>
                    </div>
                    {chapter.title && <div className="text-sm text-white">{chapter.title}</div>}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <FaRegClock />
                    <span>{moment(chapter.publishAt).fromNow()}</span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
    </div>
  )
}

export default MangaChapters
