import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import { useSearch } from 'src/hooks/useSearch'

import GoToTop from '@components/Home/GoToTop'
import MangaCard, { IMangaSearch } from '@components/Home/MangaCard'

import { SEARCH_PATH } from '@constants/routes'

import { SEARCH_MANGA } from '@gql/search'

import { useQuery } from '@apollo/client'

const Home: React.FC = (): JSX.Element => {
  const { search, setSearch } = useSearch()
  const [searchResult, setSearchResult] = useState<IMangaSearch[]>([])
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')

  const { loading, error, data } = useQuery(SEARCH_MANGA, {
    variables: { input: { name: debouncedSearch, amount: search.amount } },
  })

  const navigate = useNavigate()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search.name)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [search.name])

  useEffect(() => {
    if (debouncedSearch === '') {
      setSearchResult([])
    } else {
      navigate(SEARCH_PATH.replace(':name', debouncedSearch.toLowerCase()))
    }
  }, [debouncedSearch, navigate])

  useEffect(() => {
    if (data && data.searchMetadata) {
      setSearchResult(data.searchMetadata)
    }
  }, [data])

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
                  .map((item, index) => <MangaCard key={`manga-${index}`} data={item} />)
              ) : (
                <div className="w-full text-center">No results found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
