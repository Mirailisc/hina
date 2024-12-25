import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { FETCH_IMAGE } from '@gql/read'

import { useQuery } from '@apollo/client'

type Props = {
  image: string
  index: number
}

const ReaderImage: React.FC<Props> = ({ image, index }: Props) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  const { loading, data, error } = useQuery(FETCH_IMAGE, {
    variables: { input: { imageUrl: image } },
  })

  useEffect(() => {
    if (loading) {
      NProgress.start()
    } else {
      NProgress.done()
    }
  }, [loading])

  useEffect(() => {
    if (data?.fetchImage) {
      setImageSrc(data.fetchImage)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
      NProgress.done()
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
