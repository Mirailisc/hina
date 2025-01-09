import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import MangaList from '@/components/Home/MangaList'
import { IMangaSearch } from '@/components/Home/Thumbnail'
import Pagination from '@/components/Search/Pagination'
import TagFilter, { ITag } from '@/components/Tag/Filter'
import LoliLoading from '@/components/Utils/LoliLoading'
import PageTitle from '@/components/Utils/PageTitle'
import Skeleton from '@/components/Utils/Skeleton'

import { SEARCH_MANGA_BY_TAGS } from '@/gql/search'
import { GET_ALL_TAGS } from '@/gql/tag'

import { useLazyQuery, useQuery } from '@apollo/client'

const Tags = () => {
  const [tags, setTags] = useState<ITag[]>([])
  const [includedTags, setIncludedTags] = useState<string[]>([])
  const [searchResult, setSearchResult] = useState<IMangaSearch[]>([])
  const [page, setPage] = useState<number>(1)

  const { loading, data, error } = useQuery(GET_ALL_TAGS)

  const [fetchManga, { loading: tagLoading, data: mangaData, error: mangaError }] = useLazyQuery(SEARCH_MANGA_BY_TAGS)

  useEffect(() => {
    if (data?.getTags) {
      setTags(data.getTags)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }

    if (mangaError) {
      toast.error(mangaError.message)
    }
  }, [error, mangaError])

  useEffect(() => {
    if (mangaData?.getMangaByTags) {
      setSearchResult(mangaData.getMangaByTags)
    }
  }, [mangaData])

  useEffect(() => {
    if (includedTags.length > 0) {
      fetchManga({
        variables: {
          input: { includedTags, page },
        },
      })
    }
  }, [includedTags, page, fetchManga])

  const toggleTag = (tagId: string) => {
    setIncludedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  const clearAllTags = () => {
    setIncludedTags([])
  }

  if (loading) {
    return (
      <div className="mt-4 flex justify-center">
        <LoliLoading />
      </div>
    )
  }

  return (
    <div>
      <PageTitle title={`Tags | MangaArius`} />
      <div className="m-auto w-full px-4 xl:w-[1280px] xl:px-0">
        <div className="mt-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tags</h1>
          {includedTags.length > 0 && (
            <div className="text-right">
              <button
                className="rounded-md border border-white/20 px-4 py-2 text-white transition-colors duration-200 hover:bg-secondary-900"
                onClick={clearAllTags}
              >
                Clear All
              </button>
            </div>
          )}
        </div>
        <TagFilter tags={tags} includedTags={includedTags} toggleTag={toggleTag} />
        <div className="w-full">
          {tagLoading ? (
            <Skeleton amount={12} />
          ) : (
            <div>
              <MangaList searchResult={searchResult} />
              <Pagination searchResult={searchResult} page={page} setPage={setPage} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Tags
