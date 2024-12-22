import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

import MangaCard, { IMangaSearch } from '@components/Home/MangaCard'
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

  const navigate = useNavigate()

  const { loading, error, data } = useQuery(SEARCH_MANGA, {
    variables: { input: { name: debouncedSearch, amount: 10 } },
    skip: !debouncedSearch,
  })

  useEffect(() => {
    setSearch((prev) => ({ ...prev, name: paramName || '', amount: 10 }))
    setDebouncedSearch(paramName || '')
  }, [paramName, setSearch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch((prev) => ({ ...prev, name: value }))
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search.name !== debouncedSearch) {
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
          <Skeleton amount={12} />
        ) : (
          <div className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start">
            {searchResult.length > 0 ? (
              searchResult
                .filter((search) => search.title !== 'Untitled')
                .map((item, index) => <MangaCard key={`search-${index}`} data={item} />)
            ) : (
              <div className="w-full text-center">No results found</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
