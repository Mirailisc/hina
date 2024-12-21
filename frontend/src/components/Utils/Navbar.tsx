import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSearch } from '@hooks/useSearch'

import { BASE_PATH } from '@constants/routes'

const Navbar: React.FC = (): JSX.Element => {
  const { search, setSearch } = useSearch()
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch({ ...search, name: e.target.value })
  }

  const handleGoHome = () => {
    setSearch({ ...search, name: '' })
    navigate(BASE_PATH, { replace: true })
  }

  useEffect(() => {
    setSearch({ ...search, name: '' })
  }, [navigate, setSearch])

  return (
    <div className="sticky inset-x-0 top-0 z-40 border-b border-white/20 bg-black/50 backdrop-blur-lg">
      <div className="flex items-center justify-between px-6 py-2">
        <div onClick={handleGoHome} className="text-lg font-bold">
          MangaDiddy
        </div>
        <div>
          <input
            type="text"
            value={search.name}
            onChange={handleInputChange}
            placeholder="Search..."
            className="hidden w-80 rounded-md border border-white/20 bg-background px-2 py-1 focus:outline-none sm:block"
          />
        </div>
      </div>
    </div>
  )
}

export default Navbar
