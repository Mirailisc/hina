import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { GoHeartFill } from 'react-icons/go'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'

import remarkGfm from 'remark-gfm'

import { useUserProfile } from '@context/profileContext'

import { AUTHOR_PATH, READER_PATH } from '@constants/routes'

import { CREATE_BOOKMARK, DELETE_BOOKMARK, GET_BOOKMARK } from '@gql/bookmark'

import { useMutation, useQuery } from '@apollo/client'

import Status from './Status'

export interface IChapter {
  id: string
  chapter: string
  volume?: string
  title?: string
  translatedLanguage: string
  publishAt: string
}

export interface IManga {
  id: string
  title: string
  status: string
  description: string
  author: {
    id: string
    name: string
  }
  alternative: {
    en: string
    ja: string
    romaji: string
  }
  cover: string
  chapters: IChapter[]
}

type Props = {
  manga: IManga
}

const MangaInfo: React.FC<Props> = ({ manga }: Props): JSX.Element => {
  const { userProfile } = useUserProfile()
  const isAuthenticated = userProfile !== null

  const [isBookmarked, setIsBookmarked] = useState(false)

  const {
    data: bookmarkData,
    loading: bookmarkLoading,
    error: bookmarkError,
  } = useQuery(GET_BOOKMARK, {
    variables: { mangaId: manga.id },
    skip: !isAuthenticated,
  })

  const [createBookmark, { loading: bookmarkCreateLoading, error: bookmarkCreateError }] = useMutation(
    CREATE_BOOKMARK,
    {
      variables: { input: { mangaId: manga.id } },
      refetchQueries: [{ query: GET_BOOKMARK, variables: { mangaId: manga.id } }],
    },
  )

  const [deleteBookmark, { loading: bookmarkDeleteLoading, error: bookmarkDeleteError }] = useMutation(
    DELETE_BOOKMARK,
    {
      refetchQueries: [{ query: GET_BOOKMARK, variables: { mangaId: manga.id } }],
    },
  )

  useEffect(() => {
    if (bookmarkError) toast.error(bookmarkError.message)
    if (bookmarkCreateError) toast.error(bookmarkCreateError.message)
    if (bookmarkDeleteError) toast.error(bookmarkDeleteError.message)

    if (bookmarkData?.getBookmark?.id) {
      setIsBookmarked(true)
    } else {
      setIsBookmarked(false)
    }
  }, [bookmarkError, bookmarkCreateError, bookmarkDeleteError, bookmarkData])

  const handleBookmarkClick = async () => {
    const { data } = await createBookmark()
    if (data?.createBookmark) {
      toast.success('Bookmark added successfully!')
      setIsBookmarked(true)
    }
  }

  const handleBookmarkDelete = async () => {
    const { data } = await deleteBookmark({ variables: { bookmarkId: bookmarkData.getBookmark.id } })
    if (data?.deleteBookmark) {
      toast.success('Bookmark removed successfully!')
      setIsBookmarked(false)
    }
  }

  return (
    <div className="flex w-full flex-col rounded-lg px-4">
      <div className="grow">
        <h1 className="text-2xl font-bold">{manga.title}</h1>
        <Status status={manga.status} />
        <div className="mt-2 text-xs">
          {manga.alternative.en} {manga.alternative.ja} {manga.alternative.romaji}
        </div>
        <Link to={AUTHOR_PATH.replace(':id', manga.author.id)}>
          <div className="my-2">Author: {manga.author.name}</div>
        </Link>
        <div className="text-white/50">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{manga.description}</ReactMarkdown>
        </div>
      </div>
      {manga.chapters.length > 0 && (
        <div className="mt-auto flex flex-row items-center gap-4">
          <Link
            to={READER_PATH.replace(':id', manga.id).replace(':chapterId', manga.chapters[0].id)}
            className="rounded-md bg-primary-500 px-4 py-2 text-white transition hover:bg-primary-600"
          >
            Read First
          </Link>
          <Link
            to={READER_PATH.replace(':id', manga.id).replace(
              ':chapterId',
              manga.chapters[manga.chapters.length - 1].id,
            )}
            className="rounded-md border border-white/20 px-4 py-2 text-white transition hover:bg-secondary-900/50"
          >
            Read Last
          </Link>
          {isAuthenticated && !bookmarkLoading && (
            <button
              onClick={isBookmarked ? handleBookmarkDelete : handleBookmarkClick}
              disabled={bookmarkCreateLoading || bookmarkDeleteLoading}
              className={`group rounded-md bg-red-500 p-3`}
            >
              <GoHeartFill
                className={`transition-opacity duration-200 ${
                  isBookmarked ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'
                }`}
              />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default MangaInfo
