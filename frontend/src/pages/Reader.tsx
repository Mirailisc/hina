import { useParams } from 'react-router-dom'
import { GET_CHAPTERS, READ_MANGA } from '../gql/manga'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import Controller from '../components/Manga/Controller'
import Titlebar from '../components/Manga/Titlebar'
import toast from 'react-hot-toast'
import { ThreeDot } from 'react-loading-indicators'

const Reader: React.FC = (): JSX.Element => {
  const { id, chapterId } = useParams()
  const [images, setImages] = useState<string[]>([])
  const [chapters, setChapters] = useState<string[]>([])

  const {
    loading: mangaLoading,
    data: mangaInfo,
    error: mangaError,
  } = useQuery(GET_CHAPTERS, {
    variables: {
      metadataId: { id },
    },
  })

  const { loading, data, error } = useQuery(READ_MANGA, {
    variables: {
      input: { id: chapterId, quality: 'data' },
    },
  })

  useEffect(() => {
    if (!mangaLoading && mangaInfo?.metadata) {
      const { metadata } = mangaInfo
      setChapters(metadata.chapters)
    }
  }, [mangaInfo])

  useEffect(() => {
    if (!loading && data?.chapterImages) {
      setImages(data.chapterImages)
    }
  }, [data])

  if (error) toast.error(error.message)
  if (mangaError) toast.error(mangaError.message)

  if (mangaLoading || loading) {
    return (
      <div className="mt-10 text-center">
        <ThreeDot color="#0A81AB" size="medium" />
      </div>
    )
  }

  const currentChapterIndex = chapters.indexOf(chapterId as string)

  const chapterStates = {
    mangaId: id as string,
    current: chapterId as string,
    previous: currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null,
    next: currentChapterIndex < chapters.length - 1 ? chapters[currentChapterIndex + 1] : null,
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Titlebar mangaId={id as string} totalChapters={chapters.length} currentChapter={currentChapterIndex} />
      <Controller chapterStates={chapterStates} />
      {images.map((image, index) => (
        <img
          referrerPolicy="no-referrer"
          loading="lazy"
          key={index}
          src={image}
          alt={`page${index}`}
          className="w-full md:w-1/2"
        />
      ))}
    </div>
  )
}

export default Reader
