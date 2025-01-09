import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

import { READER_PATH } from '@/constants/routes'

import { GET_CHAPTERS } from '@/gql/manga'

import { useQuery } from '@apollo/client'

import ThumbnailImage from './Image'

export interface IBookmarkThumbnail {
  id: string
  title: string
  status: string
  cover: string
}

type Props = {
  data: IBookmarkThumbnail
  currentChapter: string
  currentLanguage: string
  bookmarkId: string
}

const BookmarkThumbnail: React.FC<Props> = ({ data, currentChapter, currentLanguage, bookmarkId }: Props) => {
  const [chapters, setChapters] = useState<{ id: string; chapter: string }[]>([])

  const {
    data: chaptersData,
    loading,
    error,
  } = useQuery(GET_CHAPTERS, {
    variables: { metadataId: { id: data.id, language: currentLanguage } },
    skip: !data.id,
  })

  useEffect(() => {
    if (error) {
      toast.error(`Failed to fetch chapters: ${error.message}`)
    }
  }, [error])

  useEffect(() => {
    if (chaptersData?.metadata?.chapters) {
      const newChapters = chaptersData.metadata.chapters.map((chapter: { id: string; chapter: string }) => ({
        id: chapter.id,
        chapter: chapter.chapter,
      }))
      setChapters(newChapters)
    }
  }, [chaptersData])

  const chapterId = chapters.find((chapter) => chapter.chapter === currentChapter)?.id || chapters[0]?.id

  const searchParams = `${currentLanguage === '' ? '' : `?lang=${currentLanguage}`}${
    bookmarkId ? `&bookmark=${bookmarkId}` : ''
  }`

  if (loading || !chapterId) {
    return <></>
  }

  return (
    <Link
      className="w-full rounded-lg transition-transform hover:scale-105"
      to={{
        pathname: READER_PATH.replace(':id', data.id).replace(':chapterId', chapterId),
        search: searchParams,
      }}
    >
      <div className="relative">
        <ThumbnailImage image={data.cover} />
        <div className="p-2">
          <div className="sm:text-md truncate text-sm font-bold text-white">{data.title}</div>
        </div>
      </div>
    </Link>
  )
}

export default BookmarkThumbnail
