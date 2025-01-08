import Skeleton from '@/components/Utils/Skeleton'

import MangaList from './MangaList'
import Pagination from './Pagination'
import { IMangaSearch } from './Thumbnail'

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
          <MangaList searchResult={searchResult} />
          <Pagination searchResult={searchResult} paginationPage={paginationPage} />
        </div>
      )}
    </>
  )
}

export default Updates
