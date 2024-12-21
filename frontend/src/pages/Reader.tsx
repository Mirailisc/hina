import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ThreeDot } from 'react-loading-indicators'
import { useParams } from 'react-router-dom'

import Controller from '@components/Reader/Controller'
import Titlebar from '@components/Reader/Titlebar'

import { GET_CHAPTERS } from '@gql/manga'
import { READ_MANGA } from '@gql/read'

import { useQuery } from '@apollo/client'

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

  const currentChapterIndex = chapters.indexOf(chapterId as string)

  const { loading, data, error } = useQuery(READ_MANGA, {
    variables: {
      input: {
        id: chapterId,
        quality: 'dataSaver',
        nextChapters: chapters.slice(currentChapterIndex + 1, currentChapterIndex + 6),
      },
    },
    skip: mangaLoading || !chapters.length,
  })

  useEffect(() => {
    if (!mangaLoading && mangaInfo?.metadata) {
      const { metadata } = mangaInfo
      setChapters(metadata.chapters)
    }
  }, [mangaInfo, mangaLoading])

  useEffect(() => {
    if (!loading && data?.chapterImages) {
      setImages(data.chapterImages)
    }
  }, [loading, data, chapterId])

  if (error) {
    toast.error(error.message)
  }
  if (mangaError) {
    toast.error(mangaError.message)
  }

  if (mangaLoading || loading) {
    return (
      <div className="mt-10 text-center">
        <ThreeDot color="#0A81AB" size="medium" />
      </div>
    )
  }

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
          key={`${chapterId}-${index}`}
          src={image}
          alt={`page${index}`}
          className="w-full md:w-1/2"
        />
      ))}
    </div>
  )
}

export default Reader
