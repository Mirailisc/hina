import React, { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { FETCH_IMAGE_WITH_CACHE } from '@/gql/read'

import { useQuery } from '@apollo/client'

type Props = {
  image: string
}

const ThumbnailImage: React.FC<Props> = ({ image }: Props) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [shouldFetch, setShouldFetch] = useState(false)
  const imageRef = useRef<HTMLDivElement | null>(null)

  const { loading, data, error } = useQuery(FETCH_IMAGE_WITH_CACHE, {
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
    if (data?.fetchImageWithCache) {
      setImageSrc(data.fetchImageWithCache)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  return (
    <div ref={imageRef}>
      {loading || imageSrc === null ? (
        <div className="aspect-[11/16] w-full animate-pulse select-none rounded-lg bg-white/30" />
      ) : (
        <img
          src={imageSrc || ''}
          alt="thumbnail"
          className="pointer-events-none aspect-[11/16] w-full select-none rounded-lg object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  )
}

export default ThumbnailImage
