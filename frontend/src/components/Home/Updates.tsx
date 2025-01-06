import { Link } from 'react-router-dom'

import Skeleton from '@components/Utils/Skeleton'

import { BASE_PATH_WITH_PAGE } from '@constants/routes'

import Thumbnail, { IMangaSearch } from './Thumbnail'

type Props = {
  loading: boolean
  searchResult: IMangaSearch[]
  paginationPage: number
}

const Updates: React.FC<Props> = ({ loading, searchResult, paginationPage }: Props): JSX.Element => {
  return (
    <>
      {loading ? (
        <Skeleton amount={18} />
      ) : (
        <div>
          {searchResult.length > 0 ? (
            <div className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start">
              {searchResult
                .filter((item) => item.title !== 'Untitled')
                .map((item, index) => (
                  <Thumbnail key={`manga-${index}`} data={item} />
                ))}
            </div>
          ) : (
            <div className="w-full text-center">No results found</div>
          )}
          {searchResult.length > 0 && (
            <div className="mt-4 flex justify-center space-x-2 p-4">
              {paginationPage === 1 ? (
                <button disabled className="rounded-md bg-gray-200 px-4 py-2 text-black disabled:opacity-50">
                  Previous
                </button>
              ) : (
                <Link to={BASE_PATH_WITH_PAGE.replace(':page', (paginationPage - 1).toString())}>
                  <button className="rounded-md bg-gray-200 px-4 py-2 text-black disabled:opacity-50">Previous</button>
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
    </>
  )
}

export default Updates
