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
    <div className="h-[230px] w-full animate-pulse select-none rounded-t-lg bg-white/30 sm:h-[270px]" />
  ) : (
    <img
      src={imageSrc || ''}
      alt="thumbnail"
      className="pointer-events-none h-[230px] w-full select-none rounded-t-lg sm:h-[270px]"
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  )
}

export default ThumbnailImage
