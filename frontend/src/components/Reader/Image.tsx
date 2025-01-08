import React, { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { FETCH_IMAGE_WITHOUT_CACHE } from '@gql/read'

import { useQuery } from '@apollo/client'

type Props = {
  image: string
  index: number
}

const ReaderImage: React.FC<Props> = ({ image, index }: Props) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [shouldFetch, setShouldFetch] = useState(false)
  const imageRef = useRef<HTMLDivElement | null>(null)

  const { loading, data, error } = useQuery(FETCH_IMAGE_WITHOUT_CACHE, {
    variables: { input: { imageUrl: image } },
    skip: !shouldFetch,
  })

  const handleVisibility = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries
    if (entry.isIntersecting) {
      setShouldFetch(true)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(handleVisibility, {
      rootMargin: '300px',
      threshold: 0.1,
    })
    const currentElement = imageRef.current
    if (currentElement) observer.observe(currentElement)

    return () => {
      if (currentElement) observer.unobserve(currentElement)
    }
  }, [handleVisibility])

  useEffect(() => {
    if (data?.fetchImageWithoutCache) {
      setImageSrc(data.fetchImageWithoutCache)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  if (loading || imageSrc === null) {
    return <div ref={imageRef} className="h-[500px] w-full bg-gray-200 md:w-1/2" />
  }

  return <img src={imageSrc} alt={`page-${index}`} className="w-full md:w-1/2" referrerPolicy="no-referrer" />
}

export default ReaderImage
