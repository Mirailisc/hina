/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import GoToTop from '@components/Home/GoToTop'
import MangaCard, { IMangaSearch } from '@components/Home/MangaCard'

import { useSearch } from 'src/hooks/useSearch'

import { SEARCH_MANGA } from '@gql/search'

import { useQuery } from '@apollo/client'

const Home: React.FC = (): JSX.Element => {
  const { search, setSearch } = useSearch()
  const [searchResult, setSearchResult] = useState<IMangaSearch[]>([])
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')

  const { loading, refetch, error } = useQuery(SEARCH_MANGA)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search.name === '') {
        setSearch({ ...search, amount: 96 })
      } else {
        setSearch({ ...search, amount: 10 })
      }
      setDebouncedSearch(search.name)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [search.name])

  const searchManga = async () => {
    const { data } = await refetch({
      input: { name: debouncedSearch, amount: search.amount },
    })

    if (data && data.searchMetadata) {
      setSearchResult(data.searchMetadata)
    }
  }

  useEffect(() => {
    searchManga()
  }, [debouncedSearch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch({ ...search, name: e.target.value })
  }

  if (error) toast.error(error.message)

  return (
    <div>
      <GoToTop />
      <div className="m-auto w-full px-4 xl:w-[1280px] xl:px-0">
        <div className="mt-4">
          <input
            type="text"
            value={search.name}
            onChange={handleInputChange}
            placeholder="Search..."
            className="block w-full rounded-md border border-white/20 bg-background px-2 py-1 focus:outline-none sm:hidden"
          />
          <h1 className="mt-4 text-2xl font-bold">Explore</h1>
        </div>
        {loading ? (
          <div className="mt-4 flex flex-wrap justify-center gap-4 xl:justify-start">
            {Array.from({ length: 18 }).map((_, index) => (
              <div
                key={index}
                className="h-[270px] w-[200px] animate-pulse rounded-md rounded-t-lg bg-white/30"
                style={{ animationDelay: `${index * 0.2}s` }}
              />
            ))}
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap justify-center gap-4 xl:justify-start">
            {searchResult.length > 0 ? (
              searchResult.map((item, index) => <MangaCard key={index} data={item} />)
            ) : (
              <div>No results found</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
