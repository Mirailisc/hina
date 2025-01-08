import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'

import Social, { ISocial } from '@/components/Author/Social'
import MangaList from '@/components/Home/MangaList'
import { IMangaSearch } from '@/components/Home/Thumbnail'
import LoliLoading from '@/components/Utils/LoliLoading'
import PageTitle from '@/components/Utils/PageTitle'

import { GET_AUTHOR_INFO } from '@/gql/author'

import { useQuery } from '@apollo/client'

const initialValue: IAuthor = {
  id: '',
  imageUrl: null,
  mangas: [],
  name: '',
  social: {
    twitter: null,
    pixiv: null,
    melonBook: null,
    fanBox: null,
    nicoVideo: null,
    fantia: null,
    tumblr: null,
    youtube: null,
    weibo: null,
    website: null,
  },
}

interface IAuthor {
  id: string
  imageUrl?: string | null
  mangas: IMangaSearch[]
  name: string
  social: ISocial
}

const Authors: React.FC = (): JSX.Element => {
  const { id } = useParams<{ id: string }>()

  const [author, setAuthor] = useState<IAuthor>(initialValue)
  const [page] = useState<number>(1)

  const { loading, data, error } = useQuery(GET_AUTHOR_INFO, {
    variables: { input: { id, mangaPage: page } },
    skip: !id,
  })

  useEffect(() => {
    if (data?.getAuthorInfo) {
      setAuthor(data.getAuthorInfo)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  return (
    <div>
      <PageTitle title={`${author.name} | MangaArius`} />
      <div className="m-auto w-full px-4 xl:w-[1280px] xl:px-0">
        <div className="my-4">
          {loading ? (
            <div className="h-[50px] w-full animate-pulse rounded-md bg-white/30 md:w-[300px]" />
          ) : (
            <h1 className="text-2xl font-bold">{author.name}</h1>
          )}
        </div>
        {loading ? (
          <div className="my-4 h-[50px] w-full animate-pulse rounded-md bg-white/30" />
        ) : (
          <Social social={author.social} />
        )}
        <div className="w-full">
          {loading ? (
            <div className="mt-4 flex justify-center">
              <LoliLoading />
            </div>
          ) : (
            <>
              <MangaList searchResult={author.mangas} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Authors
