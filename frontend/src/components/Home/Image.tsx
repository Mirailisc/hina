import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { FETCH_IMAGE_WITH_CACHE } from '@gql/read'

import { useQuery } from '@apollo/client'

type Props = {
  image: string
}

const ThumbnailImage: React.FC<Props> = ({ image }: Props) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  const { loading, data, error } = useQuery(FETCH_IMAGE_WITH_CACHE, {
    variables: { input: { imageUrl: image } },
  })

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

  return loading || imageSrc === null ? (
    <div className="aspect-[11/16] w-full animate-pulse select-none rounded-t-lg bg-white/30" />
  ) : (
    <img
      src={imageSrc || ''}
      alt="thumbnail"
      className="pointer-events-none aspect-[11/16] w-full select-none rounded-lg object-cover"
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  )
}

export default ThumbnailImage
