import React, { Suspense, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { Toaster } from 'react-hot-toast'
import { Route, Routes, useLocation } from 'react-router-dom'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import AgeConsent from '@components/Utils/AgeConsent'
import ApolloWrapper from '@components/Utils/ApolloWrapper'
import Navbar from '@components/Utils/Navbar'

import Loading from '@pages/Loading'
import NotFound from '@pages/NotFound'

import { UserProfileProvider } from '@context/provider/ProfileProvider'
import { SearchProvider } from '@context/provider/SearchProvider'

import { ACCESS_TOKEN } from '@constants/cookie'
import {
  AUTHORS_PATH,
  AUTHOR_PATH,
  BASE_PATH,
  BASE_PATH_WITH_PAGE,
  MANGA_NAME_SEARCH_PATH,
  MANGA_PATH,
  READER_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
  TAGS_PATH,
} from '@constants/routes'

const Home = React.lazy(() => import('@pages/Home'))
const Manga = React.lazy(() => import('@pages/Manga'))
const Reader = React.lazy(() => import('@pages/Reader'))
const Search = React.lazy(() => import('@pages/Search'))
const Authors = React.lazy(() => import('@pages/Author'))
const Author = React.lazy(() => import('@pages/Author/_id'))
const Tags = React.lazy(() => import('@pages/Tag'))
const SignUp = React.lazy(() => import('@pages/Auth/SignUp'))
const SignIn = React.lazy(() => import('@pages/Auth/SignIn'))

function App() {
  const [cookies] = useCookies([ACCESS_TOKEN])
  const location = useLocation()

  const uuidRegex = /([a-f0-9-]{36})/g
  const isAuthenticated = cookies[ACCESS_TOKEN]

  let replacementIndex = 0

  const modifiedPathname = location.pathname.replace(uuidRegex, () => {
    if (replacementIndex === 0) {
      replacementIndex++
      return ':id'
    } else {
      return ':chapterId'
    }
  })

  const navbarFilter = () => {
    switch (modifiedPathname) {
      case READER_PATH:
        return <></>
      default:
        return <Navbar />
    }
  }

  useEffect(() => {
    NProgress.configure({ showSpinner: false })
    NProgress.start()
    scrollTo(0, 0)
    NProgress.done()

    return () => {
      NProgress.remove()
    }
  }, [location.pathname])

  return (
    <ApolloWrapper>
      <Toaster position="bottom-right" />
      <AgeConsent />
      <SearchProvider>
        <UserProfileProvider>
          <div className="flex min-h-screen flex-col bg-background text-white">
            <Suspense fallback={<Loading />}>
              {navbarFilter()}
              <div className="grow">
                <Routes>
                  <Route path={BASE_PATH} element={<Home />} />
                  <Route path={BASE_PATH_WITH_PAGE} element={<Home />} />

                  <Route path={AUTHORS_PATH} element={<Authors />} />
                  <Route path={AUTHOR_PATH} element={<Author />} />

                  <Route path={TAGS_PATH} element={<Tags />} />

                  <Route path={MANGA_NAME_SEARCH_PATH} element={<Search />} />
                  <Route path={MANGA_PATH} element={<Manga />} />

                  <Route path={READER_PATH} element={<Reader />} />

                  {!isAuthenticated && (
                    <>
                      <Route path={SIGN_UP_PATH} element={<SignUp />} />
                      <Route path={SIGN_IN_PATH} element={<SignIn />} />
                    </>
                  )}

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </Suspense>
          </div>
        </UserProfileProvider>
      </SearchProvider>
    </ApolloWrapper>
  )
}

export default App
