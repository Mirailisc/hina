import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ThreeDot } from 'react-loading-indicators'

import { GET_ALL_TAGS } from '@gql/tag'

import { useQuery } from '@apollo/client'

interface ITag {
  id: string
  name: string
}

const Tags = () => {
  const [tags, setTags] = useState<ITag[]>([])

  const { loading, data, error } = useQuery(GET_ALL_TAGS)

  useEffect(() => {
    if (data?.getTags) {
      setTags(data.getTags)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  if (loading) {
    return (
      <div className="mt-4 text-center">
        <ThreeDot color="#0A81AB" size="medium" />
      </div>
    )
  }

  return (
    <div className="m-auto w-full px-4 xl:w-[1280px] xl:px-0">
      <div className="mt-4 flex flex-wrap gap-4">
        {tags.map((tag) => (
          <div className="rounded-md bg-white/30 px-4 py-2" key={tag.id}>
            {tag.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tags
