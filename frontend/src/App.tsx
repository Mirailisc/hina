import { ApolloProvider } from '@apollo/client'
import React, { Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { BASE_PATH, MANGA_PATH, READER_PATH } from './constants/routes'
import { client } from './lib/apollo'
import { SearchProvider } from './context/SearchContext'
import Navbar from './components/Navbar'
import Loading from './pages/Loading'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Toaster } from 'react-hot-toast'

const Home = React.lazy(() => import('./pages/Home'))
const Manga = React.lazy(() => import('./pages/Manga'))
const Reader = React.lazy(() => import('./pages/Reader'))

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
      <SearchProvider>
        <div className="min-h-screen bg-background text-white">
          <Suspense fallback={<Loading />}>
            {navbarFilter()}
            <Routes>
              <Route path={BASE_PATH} element={<Home />} />
              <Route path={MANGA_PATH} element={<Manga />} />
              <Route path={READER_PATH} element={<Reader />} />
            </Routes>
          </Suspense>
        </div>
      </SearchProvider>
    </ApolloProvider>
  )
}

export default App
