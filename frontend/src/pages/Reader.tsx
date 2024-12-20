import { useParams } from 'react-router-dom'
import { GET_CHAPTERS, READ_MANGA } from '../gql/manga'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import Controller from '../components/Manga/Controller'
import Titlebar from '../components/Manga/Titlebar'

const Reader: React.FC = (): JSX.Element => {
  const { id, chapterId } = useParams()
  const [images, setImages] = useState<string[]>([])
  const [chapters, setChapters] = useState<string[]>([])

  const { loading: mangaLoading, data: mangaInfo } = useQuery(GET_CHAPTERS, {
    variables: {
      metadataId: { id },
    },
  })

  const { loading, data } = useQuery(READ_MANGA, {
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

  if (mangaLoading || loading) {
    return <h1>Loading...</h1>
  }

  const currentChapterIndex = chapters.indexOf(chapterId as string)

  if (currentChapterIndex === -1) {
    return <h1>Chapter not found</h1>
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
