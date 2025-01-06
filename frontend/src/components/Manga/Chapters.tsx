import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { FaRegClock } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import moment from 'moment'

import { getLanguageName, isoCodeToFlagEmoji } from '@lib/lang-iso'

import { useUserProfile } from '@context/profileContext'

import { READER_PATH } from '@constants/routes'

import { GET_BOOKMARK } from '@gql/bookmark'

import { useQuery } from '@apollo/client'

import { IChapter } from './Info'

type Props = {
  id: string
  chapters: IChapter[]
  selectedLanguage: string
}

const MangaChapters: React.FC<Props> = ({ id, chapters, selectedLanguage }: Props): JSX.Element => {
  const { userProfile } = useUserProfile()
  const isAuthenticated = userProfile !== null

  const { data, loading, error } = useQuery(GET_BOOKMARK, { variables: { mangaId: id }, skip: !isAuthenticated })
  const searchParams = `${selectedLanguage === 'All' ? '' : `?lang=${selectedLanguage}`}${
    data?.getBookmark.id ? `&bookmark=${data.getBookmark.id}` : ''
  }`

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  if (loading) return <></>

  return (
    <div className="space-y-4">
      {chapters
        .filter((chapter) => getLanguageName(chapter.translatedLanguage) !== 'Unknown Language')
        .map((chapter, index) => {
          return (
            <Link
              to={{
                pathname: READER_PATH.replace(':id', id).replace(':chapterId', chapter.id),
                search: searchParams,
              }}
              key={`chapter-${chapter.chapter}-${index}-${chapter.translatedLanguage}`}
            >
              <div className="my-4 rounded-lg bg-white/10 p-4 shadow-md transition-all duration-300 ease-in-out hover:bg-white/20">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-white">
                      <span dangerouslySetInnerHTML={{ __html: isoCodeToFlagEmoji(chapter.translatedLanguage) }} />
                      <span className="font-semibold">
                        {chapter.volume ? `Vol. ${chapter.volume} ` : ''}Ch. {chapter.chapter}
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
