import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

import MangaCard, { IMangaSearch } from '@components/Home/MangaCard'

import { useSearch } from '@hooks/useSearch'

import { SEARCH_PATH } from '@constants/routes'

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
    if (paramName) {
      setSearch({ name: paramName, amount: 10 })
      setDebouncedSearch(paramName)
    } else {
      setSearch({ name: '', amount: 10 })
      setDebouncedSearch('')
    }
  }, [paramName, setSearch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch({ ...search, name: value })
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search.name)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [search.name])

  useEffect(() => {
    if (debouncedSearch && debouncedSearch !== paramName) {
      navigate(SEARCH_PATH.replace(':name', debouncedSearch.toLowerCase()))
    }
  }, [debouncedSearch, paramName, navigate])

  useEffect(() => {
    if (data && data.searchMetadata) {
      setSearchResult(data.searchMetadata)
    } else {
      setSearchResult([])
    }
  }, [data])

  if (error) toast.error(error.message)

  return (
    <div className="px-4">
      <div className="mt-4">
        <input
          type="text"
          value={search.name}
          onChange={handleInputChange}
          placeholder="Search..."
          className="block w-full rounded-md border border-white/20 bg-background px-2 py-1 focus:outline-none sm:hidden"
        />
        <h1 className="mt-4 text-2xl font-bold">Search results</h1>
      </div>
      <div className="w-full">
        {loading ? (
          <div className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-[270px] w-[200px] animate-pulse rounded-md rounded-t-lg bg-white/30"
                style={{ animationDelay: `${index * 0.2}s` }}
              />
            ))}
          </div>
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
