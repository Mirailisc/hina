import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'

import MangaChapters from '@components/Manga/Chapters'
import MangaInfo, { IManga } from '@components/Manga/Info'
import LanguageTab from '@components/Manga/LanguageTab'
import OrderButton from '@components/Manga/OrderButton'
import LoliLoading from '@components/Utils/LoliLoading'
import PageTitle from '@components/Utils/PageTitle'

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

  return (
    <div>
      <PageTitle title={`${loading ? '[LOADING]' : manga.title} | MangaArius`} />
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
                className="w-full rounded-lg md:w-[300px]"
              />
            )}
          </div>
          {loading ? (
            <div className="w-full rounded-lg px-4">
              <div className="h-[50px] w-full animate-pulse rounded-md bg-white/30" />
              <div className="my-2 h-[20px] w-full animate-pulse rounded-md bg-white/30" />
              <div className="my-2 h-[30px] w-full animate-pulse rounded-md bg-white/30" />
              <div className="my-2 h-[100px] w-full animate-pulse rounded-md bg-white/30" />
            </div>
          ) : (
            <MangaInfo manga={manga} />
          )}
        </div>
        <LanguageTab
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          languages={languages}
        />
        <OrderButton order={order} setOrder={setOrder} />
        {loading ? (
          <div className="mt-4 flex justify-center">
            <LoliLoading />
          </div>
        ) : (
          <div>
            {manga.chapters.length > 0 ? (
              <MangaChapters id={manga.id} chapters={orderedChapters()} selectedLanguage={selectedLanguage} />
            ) : (
              <span>No chapters available</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Manga
