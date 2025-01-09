import { FaAngleDoubleLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { IMangaSearch } from './Thumbnail'
import { BROWSE_PATH } from '@/constants/routes'

type Props = {
  searchResult: IMangaSearch[]
  paginationPage: number
}

const Pagination: React.FC<Props> = ({ searchResult, paginationPage }: Props): JSX.Element => {
  const totalPage = searchResult.length > 0 ? searchResult[0].totalPage : 0
  if (totalPage === 0) {
    return <></>
  }

  const pageNumbersToShow = 4
  const pageRangeStart = Math.max(1, paginationPage - pageNumbersToShow)
  const pageRangeEnd = Math.min(totalPage, paginationPage + pageNumbersToShow)

  const renderPageButton = (pageNum: number) => (
    <Link key={pageNum} to={BROWSE_PATH.replace(':page', pageNum.toString())}>
      <button
        className={`flex size-10 items-center justify-center rounded-full font-mono text-sm ${
          paginationPage === pageNum
            ? 'border-2 border-primary-700 bg-primary-600 text-white'
            : 'bg-transparent text-white hover:bg-gray-200 hover:text-black'
        }`}
      >
        {pageNum}
      </button>
    </Link>
  )

  const renderNavigationButton = (to: string, icon: React.ReactNode, disabled: boolean = false) => (
    <Link to={to}>
      <button
        disabled={disabled}
        className={`flex size-10 items-center justify-center rounded-full ${disabled ? 'cursor-not-allowed text-gray-600' : 'text-white hover:bg-gray-200 hover:text-black'}`}
      >
        {icon}
      </button>
    </Link>
  )

  return (
    <div className="my-10 flex flex-wrap items-center justify-center gap-2">
      {renderNavigationButton(
        BROWSE_PATH.replace(':page', '1'),
        <FaAngleDoubleLeft className="size-4" />,
        paginationPage === 1,
      )}

      {renderNavigationButton(
        BROWSE_PATH.replace(':page', (paginationPage - 1).toString()),
        <FaChevronLeft className="size-4" />,
        paginationPage === 1,
      )}

      {Array.from({ length: pageRangeEnd - pageRangeStart + 1 }, (_, i) => renderPageButton(pageRangeStart + i))}

      {renderNavigationButton(
        BROWSE_PATH.replace(':page', (paginationPage + 1).toString()),
        <FaChevronRight className="size-4" />,
        paginationPage === totalPage,
      )}
    </div>
  )
}

export default Pagination
