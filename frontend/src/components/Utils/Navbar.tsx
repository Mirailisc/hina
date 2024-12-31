import { useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom'

import { AnimatePresence, motion } from 'framer-motion'

import { AUTHORS_PATH, BASE_PATH, TAGS_PATH } from '@constants/routes'

const Navbar: React.FC = (): JSX.Element => {
  const [hamburgerOpen, setHamburgerOpen] = useState<boolean>(false)

  const navigate = useNavigate()

  const handleNavigate = (to: string) => {
    setHamburgerOpen(false)
    navigate(to)
  }

  const handleGoHome = () => {
    navigate(BASE_PATH, { replace: true })
    navigate(0)
  }

  return (
    <>
      <div className="sticky inset-x-0 top-0 z-40 border-b border-white/20 bg-black/80 backdrop-blur-lg xl:top-2 xl:mx-2 xl:rounded-lg xl:border">
        <div className="flex items-center justify-between gap-4 px-4 py-2 md:justify-start xl:px-[200px]">
          <div onClick={handleGoHome} className="cursor-pointer text-lg font-bold">
            MangaDiddy
          </div>
          <div className="hidden flex-row items-center gap-4 md:flex">
            <div
              onClick={() => handleNavigate(BASE_PATH)}
              className="cursor-pointer text-sm opacity-50 transition-opacity duration-200 hover:opacity-100"
            >
              Home
            </div>
            <div
              onClick={() => handleNavigate(AUTHORS_PATH)}
              className="cursor-pointer text-sm opacity-50 transition-opacity duration-200 hover:opacity-100"
            >
              Authors
            </div>
            <div
              onClick={() => handleNavigate(TAGS_PATH)}
              className="cursor-pointer text-sm opacity-50 transition-opacity duration-200 hover:opacity-100"
            >
              Tags
            </div>
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
              <div
                onClick={() => handleNavigate(BASE_PATH)}
                className="w-full cursor-pointer p-2 text-sm font-thin transition-colors duration-200 hover:bg-black/50"
              >
                Home
              </div>
              <div
                onClick={() => handleNavigate(AUTHORS_PATH)}
                className="w-full cursor-pointer p-2 text-sm font-thin transition-colors duration-200 hover:bg-black/50"
              >
                Authors
              </div>
              <div
                onClick={() => handleNavigate(TAGS_PATH)}
                className="w-full cursor-pointer p-2 text-sm font-thin transition-colors duration-200 hover:bg-black/50"
              >
                Tags
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
