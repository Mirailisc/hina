import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

import { IMangaSearch } from '@/components/Home/Thumbnail'

type Props = {
  searchResult: IMangaSearch[]
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
}
const Pagination: React.FC<Props> = ({ searchResult, page, setPage }: Props): JSX.Element => {
  return (
    <>
      {searchResult.length > 0 && (
        <div className="mt-4 flex justify-center space-x-2 p-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="flex size-10 items-center justify-center rounded-full font-mono text-sm text-white hover:bg-gray-200 hover:text-black disabled:cursor-not-allowed disabled:bg-transparent disabled:text-gray-600 disabled:opacity-50"
          >
            <FaChevronLeft className="size-4" />
          </button>
          <span className="flex size-10 select-none items-center justify-center font-mono text-sm">{page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={searchResult[0].totalPage === page}
            className="flex size-10 items-center justify-center rounded-full font-mono text-sm text-white hover:bg-gray-200 hover:text-black disabled:cursor-not-allowed disabled:bg-transparent disabled:text-gray-600 disabled:opacity-50"
          >
            <FaChevronRight className="size-4" />
          </button>
        </div>
      )}
    </>
  )
}

export default Pagination
