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
    <div>
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
              <div className="mt-4 rounded-lg bg-white/10 px-4 py-2 transition-colors duration-200 hover:bg-white/20">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start md:gap-0">
                  <div>
                    <div className="text-white">
                      <span dangerouslySetInnerHTML={{ __html: isoCodeToFlagEmoji(chapter.translatedLanguage) }} />{' '}
                      {chapter.volume ? `Vol. ${chapter.volume} ` : ''} Ch. {chapter.chapter}
                    </div>
                    {chapter.title && <div className="text-white">{chapter.title}</div>}
                  </div>
                  <div className="flex flex-row items-center justify-end gap-2">
                    <FaRegClock />
                    {moment(chapter.publishAt).fromNow()}
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
