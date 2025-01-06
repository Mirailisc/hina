import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'

import Skeleton from '@components/Utils/Skeleton'

import { useUserProfile } from '@context/profileContext'

import { GET_BOOKMARKS } from '@gql/bookmark'

import { useQuery } from '@apollo/client'

import BookmarkThumbnail from './BookmarkThumbnail'

export interface IBookmark {
  id: string
  manga: {
    id: string
    title: string
    status: string
    cover: string
  }
  currentChapter: string
  currentLanguage: string
}

const Bookmarks: React.FC = (): JSX.Element => {
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([])
  const { userProfile } = useUserProfile()
  const isAuthenticated = userProfile !== null
  const { data, loading, error, refetch } = useQuery(GET_BOOKMARKS, {
    skip: !isAuthenticated,
  })
  const location = useLocation()

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  useEffect(() => {
    if (data?.getBookmarks) {
      setBookmarks(data.getBookmarks)
    }
  }, [data])

  useEffect(() => {
    if (isAuthenticated) {
      refetch()
    }
  }, [location, isAuthenticated, refetch])

  return (
    <div>
      {bookmarks.length > 0 && (
        <>
          <h1 className="mt-4 text-2xl font-bold">Continue Reading</h1>
          {loading ? (
            <Skeleton amount={6} />
          ) : (
            <div>
              <div className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start">
                {bookmarks.map((item, index) => (
                  <BookmarkThumbnail
                    key={`bookmarked-manga-${index}`}
                    data={item.manga}
                    currentChapter={item.currentChapter}
                    currentLanguage={item.currentLanguage}
                    bookmarkId={item.id}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Bookmarks
