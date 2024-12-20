import { useParams } from 'react-router-dom'
import { GET_METADATA } from '../gql/manga'
import { useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import Status from '../components/Manga/Status'
import { Link } from 'react-router-dom'
import { READER_PATH } from '../constants/routes'
import { ThreeDot } from 'react-loading-indicators'

interface IManga {
  id: string
  title: string
  status: string
  description: string
  author: string
  alternative: {
    en: string
    ja: string
    romaji: string
  }
  cover: string
  chapters: string[]
}

const initialValue: IManga = {
  id: '',
  title: '',
  status: '',
  description: '',
  author: '',
  alternative: {
    en: '',
    ja: '',
    romaji: '',
  },
  chapters: [],
  cover: '',
}

const Manga: React.FC = (): JSX.Element => {
  const { id } = useParams()
  const { loading, data } = useQuery(GET_METADATA, {
    variables: {
      metadataId: { id },
    },
  })

  const [manga, setManga] = useState<IManga>(initialValue)
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    if (!loading && data.metadata) {
      const { metadata } = data
      setManga({
        id: metadata.id,
        title: metadata.title,
        status: metadata.status,
        description: metadata.description,
        author: metadata.author,
        alternative: metadata.alternative,
        chapters: metadata.chapters,
        cover: metadata.cover,
      })
    }
  }, [data])

  const orderedChapters = () => {
    switch (order) {
      case 'asc':
        return manga.chapters
      case 'desc':
        return [...manga.chapters].reverse()
    }
  }

  if (loading) {
    return (
      <div className="mt-4 text-center">
        <ThreeDot color="#0A81AB" size="medium" />
      </div>
    )
  }

  return (
    <div className="m-auto w-full px-4 py-10 md:px-0 xl:w-[1280px]">
      <div className="flex flex-col gap-4 md:flex-row">
        <div>
          <img src={manga.cover} about="cover" className="w-full rounded-lg border border-white/25 md:w-[300px]" />
        </div>
        <div className="relative min-h-[400px] w-full rounded-lg border border-white/25 p-4 md:min-h-[300px]">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            {manga.title} <Status status={manga.status} />
          </h1>
          <div className="text-xs">
            {manga.alternative.en} {manga.alternative.ja} {manga.alternative.romaji}
          </div>
          <p className="my-2">Author: {manga.author}</p>
          <p className="text-white/50">{manga.description}</p>
          {manga.chapters.length > 0 && (
            <div className="absolute bottom-4 mt-4 flex gap-4">
              <Link
                to={`/read/${manga.id}/chapter/${manga.chapters[0]}`}
                className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
              >
                Read First
              </Link>
              <Link
                to={`/read/${manga.id}/chapter/${manga.chapters[manga.chapters.length - 1]}`}
                className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
              >
                Read Last
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Chapters</h1>
        {order === 'asc' ? (
          <button
            onClick={() => setOrder('desc')}
            className="rounded-lg bg-white/20 px-3 py-1 text-sm text-white transition-opacity duration-200 hover:opacity-50"
          >
            Ascending
          </button>
        ) : (
          <button
            onClick={() => setOrder('asc')}
            className="rounded-lg bg-white/20 px-3 py-1 text-sm text-white transition-opacity duration-200 hover:opacity-50"
          >
            Descending
          </button>
        )}
      </div>
      <div>
        {manga.chapters.length > 0 ? (
          <div>
            {orderedChapters().map((chapter, index) => {
              const chapterIndex = order === 'asc' ? index + 1 : manga.chapters.length - index

              return (
                <div key={index} className="mt-4 border-b border-white/50 pb-2">
                  <Link
                    to={{
                      pathname: READER_PATH.replace(':id', manga.id).replace(':chapterId', chapter),
                    }}
                  >
                    <div className="text-white/50 transition-colors duration-200 hover:text-white">
                      Chapter {chapterIndex}
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        ) : (
          <span>No chapters available</span>
        )}
      </div>
    </div>
  )
}

export default Manga
