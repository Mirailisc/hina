import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useSearch } from 'src/hooks/useSearch'

import Bookmarks from '@components/Home/Bookmarks'
import GoToTop from '@components/Home/GoToTop'
import { IMangaSearch } from '@components/Home/Thumbnail'
import Updates from '@components/Home/Updates'
import PageTitle from '@components/Utils/PageTitle'

import { BASE_PATH, MANGA_NAME_SEARCH_PATH } from '@constants/routes'

import { SEARCH_MANGA } from '@gql/search'

import { useQuery } from '@apollo/client'

const Home: React.FC = (): JSX.Element => {
  const { page } = useParams()

  const { search, setSearch } = useSearch()
  const [searchResult, setSearchResult] = useState<IMangaSearch[]>([])
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')
  const [paginationPage, setPaginationPage] = useState<number>(1)

  const { loading, error, data } = useQuery(SEARCH_MANGA, {
    variables: { input: { name: '', amount: 96, page: paginationPage } },
  })

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (page && !isNaN(Number(page))) {
      setPaginationPage(Number(page))
    }
  }, [page])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search.name.trim())
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [search.name])

  useEffect(() => {
    if (debouncedSearch) {
      navigate(MANGA_NAME_SEARCH_PATH.replace(':name', debouncedSearch.toLowerCase()))
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
    setSearch({ ...search, name: e.target.value })
  }

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  return (
    <div>
      <PageTitle title={`Recent Updates | MangaDiddy`} />
      <GoToTop />
      <div className="m-auto w-full px-4 xl:w-[1280px] xl:px-0">
        <div className="mt-4">
          <input
            type="text"
            value={search.name}
            onChange={handleInputChange}
            placeholder="Search..."
            className="w-full rounded-md border border-white/20 bg-background px-2 py-1 focus:outline-none"
          />
        </div>
        {location.pathname === BASE_PATH && <Bookmarks />}
        <h1 className="mt-4 text-2xl font-bold">Recent Updates</h1>
        <div className="w-full">
          <Updates loading={loading} searchResult={searchResult} paginationPage={paginationPage} />
        </div>
      </div>
    </div>
  )
}

export default Home
