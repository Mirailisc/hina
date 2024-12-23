import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

import Thumbnail, { IMangaSearch } from '@components/Home/Thumbnail'
import Skeleton from '@components/Utils/Skeleton'

import { useSearch } from '@hooks/useSearch'

import { MANGA_NAME_SEARCH_PATH } from '@constants/routes'

import { SEARCH_MANGA } from '@gql/search'

import { useQuery } from '@apollo/client'

const Search: React.FC = (): JSX.Element => {
  const { search, setSearch } = useSearch()
  const { name: paramName } = useParams<{ name: string }>()
  const [searchResult, setSearchResult] = useState<IMangaSearch[]>([])
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)

  const navigate = useNavigate()

  const { loading, error, data } = useQuery(SEARCH_MANGA, {
    variables: { input: { name: debouncedSearch, amount: 12, page } },
    fetchPolicy: 'cache-and-network',
    skip: !debouncedSearch,
  })

  useEffect(() => {
    setSearch((prev) => ({ ...prev, name: paramName || '', amount: 12 }))
    setDebouncedSearch(paramName || '')
  }, [paramName, setSearch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch((prev) => ({ ...prev, name: value }))
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search.name !== debouncedSearch) {
        setPage(1)
        setDebouncedSearch(search.name)
      }
    }, 1000)
    return () => clearTimeout(timeoutId)
  }, [search.name, debouncedSearch])

  useEffect(() => {
    if (debouncedSearch && debouncedSearch !== paramName) {
      navigate(MANGA_NAME_SEARCH_PATH.replace(':name', debouncedSearch.toLowerCase()))
    }
  }, [debouncedSearch, paramName, navigate])

  useEffect(() => {
    if (data && data.searchMetadata) {
      setSearchResult(data.searchMetadata)
    } else {
      setSearchResult([])
    }
  }, [data])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  return (
    <div className="px-4">
      <div className="mt-4">
        <input
          type="text"
          value={search.name}
          onChange={handleInputChange}
          placeholder="Search..."
          className="w-full rounded-md border border-white/20 bg-background px-2 py-1 focus:outline-none"
        />
        <h1 className="mt-4 text-2xl font-bold">Search results</h1>
      </div>
      <div className="w-full">
        {loading ? (
          <Skeleton amount={18} />
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
                  disabled={searchResult[0].totalPage === page}
                  className="rounded-md bg-gray-200 px-4 py-2 text-black"
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

export default Search
