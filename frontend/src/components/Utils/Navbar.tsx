import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { FaSignOutAlt } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { AnimatePresence, motion } from 'framer-motion'

import { useAuth } from '@/context/authContext'

import { ACCESS_TOKEN } from '@/constants/cookie'
import { AUTHORS_PATH, BASE_PATH, SIGN_IN_PATH, SIGN_UP_PATH, TAGS_PATH } from '@/constants/routes'

const Navbar: React.FC = (): JSX.Element => {
  const [, , removeCookies] = useCookies([ACCESS_TOKEN])
  const { auth } = useAuth()
  const [hamburgerOpen, setHamburgerOpen] = useState<boolean>(false)

  const navigate = useNavigate()
  const isAuthenticated = auth !== null

  const handleNavigate = (to: string) => {
    setHamburgerOpen(false)
    navigate(to)
  }

  const handleGoHome = () => {
    navigate(BASE_PATH, { replace: true })
    navigate(0)
  }

  const handleSignOut = () => {
    removeCookies(ACCESS_TOKEN)
    navigate(BASE_PATH, { replace: true })
    navigate(0)
  }

  return (
    <>
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-lg">
        <div className="flex items-center justify-between p-4 xl:justify-around">
          <div className="flex items-center justify-between gap-4 md:justify-start">
            <div onClick={handleGoHome} className="cursor-pointer text-lg font-bold">
              Hiwa
            </div>
            <div className="hidden flex-row items-center gap-4 md:flex">
              <div
                onClick={handleGoHome}
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
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="rounded-md border border-white/20 p-2 transition-colors duration-200 hover:bg-secondary-900"
              >
                <FaSignOutAlt data-cy="sign-out" />
              </button>
            ) : (
              <div className="flex flex-row items-center gap-4">
                <Link
                  to={SIGN_IN_PATH}
                  className="cursor-pointer text-sm opacity-50 transition-opacity duration-200 hover:opacity-100"
                >
                  Login
                </Link>
                <Link to={SIGN_UP_PATH}>
                  <button className="rounded-md border border-white/20 px-4 py-1 transition-colors duration-200 hover:bg-secondary-900">
                    Register
                  </button>
                </Link>
              </div>
            )}
            <button
              onClick={() => setHamburgerOpen(!hamburgerOpen)}
              className="rounded-md border border-white/20 p-2 transition-colors duration-200 hover:bg-secondary-900 md:hidden"
            >
              <GiHamburgerMenu />
            </button>
          </div>
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
