import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

import Bookmarks from '@/components/Home/Bookmarks'
import GoToTop from '@/components/Home/GoToTop'
import MangaList from '@/components/Home/MangaList'
import Pagination from '@/components/Home/Pagination'
import { IMangaSearch } from '@/components/Home/Thumbnail'
import PageTitle from '@/components/Utils/PageTitle'
import Skeleton from '@/components/Utils/Skeleton'

import { SEARCH_MANGA } from '@/gql/search'

import { useQuery } from '@apollo/client'
import { SEARCH_PATH } from '@/constants/routes'

const Home: React.FC = (): JSX.Element => {
  const { page } = useParams()

  const [search, setSearch] = useState<string>('')
  const [searchResult, setSearchResult] = useState<IMangaSearch[]>([])
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')
  const [paginationPage, setPaginationPage] = useState<number>(1)

  const { loading, error, data } = useQuery(SEARCH_MANGA, {
    variables: { input: { name: '', amount: 40, page: paginationPage } },
  })

  const navigate = useNavigate()

  useEffect(() => {
    if (page && !isNaN(Number(page))) {
      setPaginationPage(Number(page))
    }
  }, [page])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [search])

  useEffect(() => {
    if (debouncedSearch) {
      navigate(SEARCH_PATH.replace(':name', debouncedSearch.toLowerCase()))
    } else {
      setSearchResult([])
    }
  }, [debouncedSearch, navigate])

  useEffect(() => {
    if (data?.searchMetadata) {
      setSearchResult(data.searchMetadata)
    } else {
      setSearchResult([])
    }
  }, [data])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  return (
    <div>
      <PageTitle title={`Recent Updates | Hiwa`} />
      <GoToTop />
      <div className="m-auto w-full px-4 xl:w-[1280px] xl:px-0">
        <div className="mt-4">
          <input
            type="text"
            value={search}
            onChange={handleInputChange}
            data-cy="search"
            placeholder="Search..."
            className="w-full rounded-md border border-white/20 bg-background px-4 py-2 text-sm focus:outline-none"
          />
        </div>
        <Bookmarks />
        <h1 className="my-8 text-2xl font-bold">Recent Updates</h1>
        <div className="w-full">
          {loading ? (
            <Skeleton amount={18} />
          ) : (
            <div>
              <MangaList searchResult={searchResult} />
              <Pagination searchResult={searchResult} paginationPage={paginationPage} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
