import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { FETCH_IMAGE_WITHOUT_CACHE } from '@gql/read'

import { useQuery } from '@apollo/client'

type Props = {
  image: string
  index: number
}

const ReaderImage: React.FC<Props> = ({ image, index }: Props) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  const { loading, data, error } = useQuery(FETCH_IMAGE_WITHOUT_CACHE, {
    variables: { input: { imageUrl: image } },
  })

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
    return <></>
  }

  return (
    <img
      key={image}
      src={imageSrc || ''}
      alt={`page-${index}`}
      className="w-full md:w-1/2"
      referrerPolicy="no-referrer"
    />
  )
}

export default ReaderImage
