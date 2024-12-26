import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { useSearch } from 'src/hooks/useSearch'

import GoToTop from '@components/Home/GoToTop'
import Thumbnail, { IMangaSearch } from '@components/Home/Thumbnail'
import Skeleton from '@components/Utils/Skeleton'

import { BASE_PATH_WITH_PAGE, MANGA_NAME_SEARCH_PATH } from '@constants/routes'

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

  useEffect(() => {
    document.title = 'Recent Updates | MangaDiddy'
  }, [])

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
          <h1 className="mt-4 text-2xl font-bold">Recent Updates</h1>
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
                  {paginationPage === 1 ? (
                    <button disabled className="rounded-md bg-gray-200 px-4 py-2 text-black disabled:opacity-50">
                      Previous
                    </button>
                  ) : (
                    <Link to={BASE_PATH_WITH_PAGE.replace(':page', (paginationPage - 1).toString())}>
                      <button className="rounded-md bg-gray-200 px-4 py-2 text-black disabled:opacity-50">
                        Previous
                      </button>
                    </Link>
                  )}
                  <span className="flex items-center px-4 py-2 text-lg font-medium">{paginationPage}</span>
                  {searchResult[0].totalPage === paginationPage ? (
                    <button disabled className="rounded-md bg-gray-200 px-4 py-2 text-black disabled:opacity-50">
                      Next
                    </button>
                  ) : (
                    <Link to={BASE_PATH_WITH_PAGE.replace(':page', (paginationPage + 1).toString())}>
                      <button className="rounded-md bg-gray-200 px-4 py-2 text-black">Next</button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
