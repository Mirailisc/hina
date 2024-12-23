import { useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { AnimatePresence, motion } from 'framer-motion'

import { useSearch } from '@hooks/useSearch'

import { AUTHORS_PATH, BASE_PATH, TAGS_PATH } from '@constants/routes'

const Navbar: React.FC = (): JSX.Element => {
  const { search, setSearch } = useSearch()
  const [hamburgerOpen, setHamburgerOpen] = useState<boolean>(false)

  const navigate = useNavigate()

  const handleGoHome = () => {
    setSearch({ ...search, name: '' })
    navigate(BASE_PATH, { replace: true })
  }

  return (
    <>
      <div className="sticky inset-x-0 top-0 z-40 border-b border-white/20 bg-black/90 backdrop-blur-lg">
        <div className="flex items-center justify-between gap-4 px-4 py-2 md:justify-start xl:px-[200px]">
          <div onClick={handleGoHome} className="cursor-pointer text-lg font-bold">
            MangaDiddy
          </div>
          <div className="hidden flex-row items-center gap-4 md:flex">
            <Link to={BASE_PATH} className="text-sm opacity-50 transition-opacity duration-200 hover:opacity-100">
              Home
            </Link>
            <Link className="text-sm opacity-50 transition-opacity duration-200 hover:opacity-100" to={AUTHORS_PATH}>
              Authors
            </Link>
            <Link to={TAGS_PATH} className="text-sm opacity-50 transition-opacity duration-200 hover:opacity-100">
              Tags
            </Link>
          </div>
          <button
            onClick={() => setHamburgerOpen(!hamburgerOpen)}
            className="rounded-md border border-white/20 p-2 transition-colors duration-200 hover:bg-secondary-900 md:hidden"
          >
            <GiHamburgerMenu />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {hamburgerOpen && (
          <motion.div
            className="fixed inset-x-0 top-[50px] z-30 border-b border-white/20 bg-black/80 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col items-start p-2">
              <Link
                to={BASE_PATH}
                className="w-full p-2 text-sm font-thin transition-colors duration-200 hover:bg-black/50"
              >
                Home
              </Link>
              <Link
                className="w-full p-2 text-sm font-thin transition-colors duration-200 hover:bg-black/50"
                to={AUTHORS_PATH}
              >
                Authors
              </Link>
              <Link
                to={TAGS_PATH}
                className="w-full p-2 text-sm font-thin transition-colors duration-200 hover:bg-black/50"
              >
                Tags
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
