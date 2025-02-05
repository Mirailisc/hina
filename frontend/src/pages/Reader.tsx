import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams, useSearchParams } from 'react-router-dom'

import Controller from '@/components/Reader/Controller'
import ReaderImage from '@/components/Reader/Image'
import Titlebar from '@/components/Reader/Titlebar'
import LoliLoading from '@/components/Utils/LoliLoading'
import PageTitle from '@/components/Utils/PageTitle'

import { useAuth } from '@/context/authContext'

import { UPDATE_BOOKMARK } from '@/gql/bookmark'
import { GET_CHAPTERS } from '@/gql/manga'
import { READ_MANGA } from '@/gql/read'

import { useMutation, useQuery } from '@apollo/client'

const Reader: React.FC = (): JSX.Element => {
  const { auth } = useAuth()
  const { id, chapterId } = useParams()
  const [images, setImages] = useState<string[]>([])
  const [chapters, setChapters] = useState<{ id: string; chapter: string }[]>([])

  const [searchParams] = useSearchParams()
  const isAuthenticated = auth !== null
  const bookmarkId = searchParams.get('bookmark')
  const currentLanguage = searchParams.get('lang') || ''

  const [updateBookmark] = useMutation(UPDATE_BOOKMARK, {
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const {
    loading: mangaLoading,
    data: mangaInfo,
    error: mangaError,
  } = useQuery(GET_CHAPTERS, {
    variables: { metadataId: { id, language: currentLanguage } },
  })

  const currentChapterIndex = chapters.findIndex((chapter) => chapter.id === chapterId)
  const nextChapters = chapters.slice(currentChapterIndex + 1, currentChapterIndex + 6).map((chapter) => chapter.id)
  const currentChapter = chapters.find((chapter) => chapter.id === chapterId)?.chapter

  const {
    loading: readLoading,
    data: readData,
    error: readError,
    refetch,
  } = useQuery(READ_MANGA, {
    variables: { input: { id: chapterId, quality: 'dataSaver', nextChapters } },
    skip: mangaLoading || chapters.length === 0 || !chapterId,
  })

  const fetchImages = useCallback(() => {
    if (readData?.chapterImages) {
      setImages(readData.chapterImages)
    }
  }, [readData])

  useEffect(() => {
    if (mangaInfo?.metadata?.chapters) {
      setChapters(
        mangaInfo.metadata.chapters.map((chapter: { id: string; chapter: string }) => ({
          id: chapter.id,
          chapter: chapter.chapter,
        })),
      )
    }
  }, [mangaInfo])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  useEffect(() => {
    if (chapterId && chapters.length > 0) {
      refetch({
        input: { id: chapterId, quality: 'dataSaver', nextChapters },
      })
    }
  }, [chapterId, chapters, refetch, nextChapters])

  useEffect(() => {
    if (bookmarkId && isAuthenticated && currentChapter) {
      updateBookmark({
        variables: { bookmarkId, currentChapter, currentLanguage },
      })
    }
  }, [bookmarkId, isAuthenticated, currentChapter, currentLanguage, updateBookmark])

  useEffect(() => {
    const errorMessages = [mangaError, readError]
    errorMessages.forEach((err) => {
      if (err) toast.error(err.message)
    })
  }, [mangaError, readError])

  if (mangaLoading || readLoading) {
    return (
      <div className="mt-10 flex justify-center">
        <LoliLoading />
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
          mangaLoading || readLoading
            ? '[LOADING] | Hina'
            : `Ch. ${chapters[currentChapterIndex]?.chapter || currentChapterIndex} | Hina`
        }
      />
      <Titlebar mangaId={id as string} />
      <Controller chapterStates={chapterStates} language={currentLanguage} bookmarkId={bookmarkId} />
      {images.length > 0 &&
        images.map((image, index) => <ReaderImage key={`${image}-${index}`} image={image} index={index} />)}
    </div>
  )
}

export default Reader
