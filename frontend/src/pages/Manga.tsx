import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ThreeDot } from 'react-loading-indicators'
import { useParams } from 'react-router-dom'

import MangaChapters from '@components/Manga/Chapters'
import MangaInfo, { IManga } from '@components/Manga/Info'

import { getLanguageName } from '@lib/lang-iso'

import { GET_METADATA } from '@gql/manga'

import { useQuery } from '@apollo/client'

const initialValue: IManga = {
  id: '',
  title: '',
  status: '',
  description: '',
  author: {
    id: '',
    name: '',
  },
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
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All')

  useEffect(() => {
    if (!loading && data?.metadata) {
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
  }, [loading, data])

  const orderedChapters = () => {
    const filteredChapters =
      selectedLanguage === 'All'
        ? manga.chapters
        : manga.chapters.filter((chapter) => chapter.translatedLanguage === selectedLanguage)
    return order === 'asc'
      ? [...filteredChapters].sort((a, b) => parseFloat(a.chapter) - parseFloat(b.chapter))
      : [...filteredChapters].sort((a, b) => parseFloat(b.chapter) - parseFloat(a.chapter))
  }

  const languages = ['All', ...new Set(manga.chapters.map((chapter) => chapter.translatedLanguage))]

  if (error) toast.error(error.message)

  useEffect(() => {
    document.title = `${manga.title} | MangaDiddy`
  }, [manga.title])

  return (
    <div className="m-auto w-full px-4 py-10 md:px-0 xl:w-[1280px]">
      <div className="flex flex-col gap-4 md:flex-row">
        <div>
          {loading ? (
            <div className="h-[700px] w-full animate-pulse rounded-lg bg-white/30 md:h-[400px] md:w-[300px]" />
          ) : (
            <img
              src={manga.cover}
              alt="cover"
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
      <div className="mt-4 overflow-x-auto">
        <ul className="flex space-x-4">
          {languages.map((lang) => (
            <li
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`cursor-pointer px-4 py-2 ${
                selectedLanguage === lang ? 'border-b-2 border-white text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {lang === 'All' ? 'All' : getLanguageName(lang)}
            </li>
          ))}
        </ul>
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
        <div className="mt-4 text-center">
          <ThreeDot color="#0A81AB" size="medium" />
        </div>
      ) : (
        <div>
          {manga.chapters.length > 0 ? (
            <MangaChapters id={manga.id} chapters={orderedChapters()} />
          ) : (
            <span>No chapters available</span>
          )}
        </div>
      )}
    </div>
  )
}

export default Manga
