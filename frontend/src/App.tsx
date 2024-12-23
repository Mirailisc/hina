import React, { Suspense, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Route, Routes, useLocation } from 'react-router-dom'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import AgeConsent from '@components/Utils/AgeConsent'
import Footer from '@components/Utils/Footer'
import Navbar from '@components/Utils/Navbar'

import Loading from '@pages/Loading'

import { client } from '@lib/apollo'

import { SearchProvider } from '@context/provider/SearchProvider'

import {
  AUTHORS_PATH,
  BASE_PATH,
  BASE_PATH_WITH_PAGE,
  MANGA_NAME_SEARCH_PATH,
  MANGA_PATH,
  READER_PATH,
} from '@constants/routes'

import { ApolloProvider } from '@apollo/client'

const Home = React.lazy(() => import('@pages/Home'))
const Manga = React.lazy(() => import('@pages/Manga'))
const Reader = React.lazy(() => import('@pages/Reader'))
const Search = React.lazy(() => import('@pages/Search'))
const Authors = React.lazy(() => import('@pages/Author'))

function App() {
  const location = useLocation()

  const uuidRegex = /([a-f0-9-]{36})/g

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

  const footerFilter = () => {
    if (modifiedPathname === READER_PATH) {
      return <></>
    } else {
      return <Footer />
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
    <ApolloProvider client={client}>
      <Toaster position="bottom-right" />
      <AgeConsent />
      <SearchProvider>
        <div className="flex min-h-screen flex-col bg-background text-white">
          <Suspense fallback={<Loading />}>
            {navbarFilter()}
            <div className="grow">
              <Routes>
                <Route path={BASE_PATH} element={<Home />} />
                <Route path={BASE_PATH_WITH_PAGE} element={<Home />} />

                <Route path={AUTHORS_PATH} element={<Authors />} />

                <Route path={MANGA_NAME_SEARCH_PATH} element={<Search />} />
                <Route path={MANGA_PATH} element={<Manga />} />

                <Route path={READER_PATH} element={<Reader />} />
              </Routes>
            </div>
            {footerFilter()}
          </Suspense>
        </div>
      </SearchProvider>
    </ApolloProvider>
  )
}

export default App
