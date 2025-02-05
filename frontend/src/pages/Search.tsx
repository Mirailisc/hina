import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

import MangaList from '@/components/Home/MangaList'
import { IMangaSearch } from '@/components/Home/Thumbnail'
import Pagination from '@/components/Search/Pagination'
import PageTitle from '@/components/Utils/PageTitle'
import Skeleton from '@/components/Utils/Skeleton'

import { SEARCH_PATH } from '@/constants/routes'

import { SEARCH_MANGA } from '@/gql/search'

import { useQuery } from '@apollo/client'

const Search: React.FC = (): JSX.Element => {
  const [search, setSearch] = useState<{ name: string; amount: number }>({
    name: '',
    amount: 40,
  })
  const { name: paramName } = useParams<{ name: string }>()
  const [searchResult, setSearchResult] = useState<IMangaSearch[]>([])
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)

  const navigate = useNavigate()

  const { loading, error, data } = useQuery(SEARCH_MANGA, {
    variables: { input: { name: debouncedSearch, amount: 40, page } },
    fetchPolicy: 'cache-and-network',
    skip: !debouncedSearch,
  })

  useEffect(() => {
    setSearch((prev) => ({ ...prev, name: paramName || '', amount: 40 }))
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

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  return (
    <div className="m-auto w-full px-4 xl:w-[1280px] xl:px-0">
      <PageTitle title={`Search ${debouncedSearch} | Hina`} />
      <div className="mt-4">
        <input
          type="text"
          value={search.name}
          onChange={handleInputChange}
          placeholder="Search..."
          className="w-full rounded-md border border-white/20 bg-background px-4 py-2 text-sm focus:outline-none"
        />
        <h1 className="mt-4 text-2xl font-bold">Search results</h1>
      </div>
      <div className="w-full">
        {loading ? (
          <Skeleton amount={18} />
        ) : (
          <div>
            <MangaList searchResult={searchResult} />
            <Pagination searchResult={searchResult} page={page} setPage={setPage} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
