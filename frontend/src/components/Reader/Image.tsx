import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

type Props = {
  image: string
  index: number
}

const ReaderImage: React.FC<Props> = ({ image, index }: Props) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  useEffect(() => {
    const fetchImage = async () => {
      NProgress.start()
      try {
        const response = await fetch(image, {
          headers: {
            referer: 'https://mangadex.org/',
            'user-agent':
              'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
            accept: '*/*',
            origin: 'https://mangadex.org/',
          },
        })

        if (response.ok) {
          const blob = await response.blob()
          const blobUrl = URL.createObjectURL(blob)
          setImageSrc(blobUrl)
        } else {
          toast.error('Failed to load image: ' + response.statusText)
        }
      } catch (error) {
        toast.error('Error fetching image: ' + error)
      } finally {
        NProgress.done()
      }
    }

    fetchImage()
  }, [image])

  if (!imageSrc) {
    return <></>
  }

  return (
    <img key={image} src={imageSrc} alt={`page-${index}`} className="w-full md:w-1/2" referrerPolicy="no-referrer" />
  )
}

export default ReaderImage
