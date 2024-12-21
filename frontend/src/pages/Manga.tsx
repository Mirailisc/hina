/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ThreeDot } from 'react-loading-indicators'
import { useParams } from 'react-router-dom'

import MangaChapters from '@components/Manga/Chapters'
import MangaInfo, { IManga } from '@components/Manga/Info'

import { GET_METADATA } from '@gql/manga'

import { useQuery } from '@apollo/client'

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
  const { loading, data, error } = useQuery(GET_METADATA, {
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

  if (error) toast.error(error.message)

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
          {loading ? (
            <div className="h-[700px] w-full animate-pulse rounded-lg bg-white/30 md:h-[400px] md:w-[300px]" />
          ) : (
            <img
              src={manga.cover}
              about="cover"
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full rounded-lg border border-white/25 md:w-[300px]"
            />
          )}
        </div>
        {loading ? (
          <div className="w-full rounded-lg border border-white/25 p-4">
            <div className="h-[50px] w-full animate-pulse rounded-md bg-white/30" />
            <div className="my-2 h-[20px] w-full animate-pulse rounded-md bg-white/30" />
            <div className="my-2 h-[30px] w-full animate-pulse rounded-md bg-white/30" />
            <div className="my-2 h-[100px] w-full animate-pulse rounded-md bg-white/30" />
          </div>
        ) : (
          <MangaInfo manga={manga} />
        )}
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
      {loading ? (
        <div className="mt-10 text-center">
          <ThreeDot color="#0A81AB" size="medium" />
        </div>
      ) : (
        <div>
          {manga.chapters.length > 0 ? (
            <MangaChapters id={manga.id} chapters={orderedChapters()} order={order} />
          ) : (
            <span>No chapters available</span>
          )}
        </div>
      )}
    </div>
  )
}

export default Manga
