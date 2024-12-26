import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaTimes } from 'react-icons/fa'
import { ThreeDot } from 'react-loading-indicators'

import Thumbnail, { IMangaSearch } from '@components/Home/Thumbnail'
import TagFilter, { ITag } from '@components/Tag/Filter'
import Skeleton from '@components/Utils/Skeleton'

import { SEARCH_MANGA_BY_TAGS } from '@gql/search'
import { GET_ALL_TAGS } from '@gql/tag'

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

  const removeTag = (tagId: string) => {
    setIncludedTags((prev) => prev.filter((id) => id !== tagId))
  }

  const clearAllTags = () => {
    setIncludedTags([])
  }

  if (loading) {
    return (
      <div className="mt-4 text-center">
        <ThreeDot color="#0A81AB" size="medium" />
      </div>
    )
  }

  return (
    <div className="m-auto w-full px-4 xl:w-[1280px] xl:px-0">
      <div className="my-4 border-b border-white/25">
        <h1 className="mt-4 text-2xl font-bold">Tags</h1>
        <div className="my-4 flex flex-wrap gap-2">
          {includedTags.length > 0 ? (
            includedTags.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId)
              return (
                tag && (
                  <div className="flex items-center gap-2 rounded-md bg-primary-700 px-4 py-2 text-white" key={tag.id}>
                    {tag.name}
                    <button className="text-white hover:text-gray-200" onClick={() => removeTag(tag.id)}>
                      <FaTimes />
                    </button>
                  </div>
                )
              )
            })
          ) : (
            <span>None</span>
          )}
        </div>
        {includedTags.length > 0 && (
          <div className="my-4 text-right">
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
            <div className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start">
              {searchResult.length > 0 ? (
                searchResult
                  .filter((item) => item.title !== 'Untitled')
                  .map((item, index) => <Thumbnail key={`manga-${index}`} data={item} />)
              ) : (
                <div className="w-full text-center">No results found</div>
              )}
            </div>
            {searchResult.length > 0 && (
              <div className="mt-4 flex justify-center space-x-2 p-4">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="rounded-md bg-gray-200 px-4 py-2 text-black disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="flex items-center px-4 py-2 text-lg font-medium">{page}</span>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={searchResult.length > 0 && page === searchResult[0].totalPage}
                  className="rounded-md bg-gray-200 px-4 py-2 text-black disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Tags
