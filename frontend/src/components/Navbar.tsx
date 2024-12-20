import { Link } from 'react-router-dom'
import { useSearch } from '../context/SearchContext'
import { BASE_PATH } from '../constants/routes'

const Navbar: React.FC = (): JSX.Element => {
  const { search, setSearch } = useSearch()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch({ ...search, name: e.target.value })
  }

  return (
    <div className="sticky inset-x-0 top-0 border-b border-white/20 bg-black/50 backdrop-blur-lg">
      <div className="flex items-center justify-between px-6 py-2">
        <Link to={BASE_PATH}>
          <div className="text-lg font-bold">Ui</div>
        </Link>
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
