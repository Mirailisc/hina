import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { useSearch } from '@hooks/useSearch'

import { AUTHORS_PATH, BASE_PATH } from '@constants/routes'

const Navbar: React.FC = (): JSX.Element => {
  const { search, setSearch } = useSearch()
  const navigate = useNavigate()

  const handleGoHome = () => {
    setSearch({ ...search, name: '' })
    navigate(BASE_PATH, { replace: true })
  }

  return (
    <div className="sticky inset-x-0 top-0 z-40 border-b border-white/20 bg-black/50 backdrop-blur-lg">
      <div className="flex items-center justify-between px-6 py-2">
        <div onClick={handleGoHome} className="text-lg font-bold">
          MangaDiddy
        </div>
        <div className="hidden flex-row items-center gap-2 md:flex">
          <Link className="transition-colors duration-200 hover:text-primary-500" to={AUTHORS_PATH}>
            Authors
          </Link>
          <div>Tags</div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
