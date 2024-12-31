import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ThreeDot } from 'react-loading-indicators'
import { useParams, useSearchParams } from 'react-router-dom'

import Controller from '@components/Reader/Controller'
import ReaderImage from '@components/Reader/Image'
import Titlebar from '@components/Reader/Titlebar'
import PageTitle from '@components/Utils/PageTitle'

import { GET_CHAPTERS } from '@gql/manga'
import { READ_MANGA } from '@gql/read'

import { useQuery } from '@apollo/client'

const Reader: React.FC = (): JSX.Element => {
  const { id, chapterId } = useParams()
  const [images, setImages] = useState<string[]>([])
  const [chapters, setChapters] = useState<{ id: string; chapter: string }[]>([])

  const [searchParams] = useSearchParams()

  const {
    loading: mangaLoading,
    data: mangaInfo,
    error: mangaError,
  } = useQuery(GET_CHAPTERS, {
    variables: {
      metadataId: { id, language: searchParams.get('lang') },
    },
  })

  const currentChapterIndex = chapters.findIndex((chapter) => chapter.id === chapterId)
  const nextChapters = chapters.slice(currentChapterIndex + 1, currentChapterIndex + 6).map((chapter) => chapter.id)

  const { loading, data, error, refetch } = useQuery(READ_MANGA, {
    variables: {
      input: {
        id: chapterId,
        quality: 'dataSaver',
        nextChapters,
      },
    },
    skip: mangaLoading || chapters.length === 0,
  })

  const fetchImages = useCallback(() => {
    if (!loading && data?.chapterImages) {
      setImages(data.chapterImages)
    }
  }, [loading, data])

  useEffect(() => {
    if (!mangaLoading && mangaInfo?.metadata?.chapters) {
      const newChapters = mangaInfo.metadata.chapters.map((chapter: { id: string; chapter: string }) => ({
        id: chapter.id,
        chapter: chapter.chapter,
      }))
      setChapters(newChapters)
    }
  }, [mangaInfo, mangaLoading])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  useEffect(() => {
    if (chapterId && !mangaLoading && chapters.length > 0) {
      refetch({
        input: {
          id: chapterId,
          quality: 'dataSaver',
          nextChapters,
        },
      })
    }
  }, [chapterId, mangaLoading, chapters, refetch, nextChapters, fetchImages])

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
    previous: currentChapterIndex > 0 ? chapters[currentChapterIndex - 1]?.id : null,
    next: currentChapterIndex < chapters.length - 1 ? chapters[currentChapterIndex + 1]?.id : null,
  }

  return (
    <div className="flex flex-col items-center justify-center py-[100px]">
      <PageTitle
        title={
          loading || mangaLoading
            ? '[LOADING] | MangaDiddy'
            : `Ch. ${chapters[currentChapterIndex] ? chapters[currentChapterIndex].chapter : currentChapterIndex} | MangaDiddy`
        }
      />
      <Titlebar mangaId={id as string} />
      <Controller chapterStates={chapterStates} language={searchParams.get('lang')} />
      {images.length > 0 && images.map((image, index) => <ReaderImage key={image} image={image} index={index} />)}
    </div>
  )
}

export default Reader
