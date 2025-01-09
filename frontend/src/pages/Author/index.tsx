import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import NameTag, { IAuthorThumbnail } from '@/components/Author/NameTag'
import Pagination from '@/components/Author/Pagination'
import LoliLoading from '@/components/Utils/LoliLoading'
import PageTitle from '@/components/Utils/PageTitle'

import { GET_ALL_AUTHORS } from '@/gql/author'

import { useQuery } from '@apollo/client'

const Authors: React.FC = (): JSX.Element => {
  const [page, setPage] = useState<number>(1)
  const [searchName, setSearchName] = useState<string>('')
  const [debouncedSearchName, setDebouncedSearchName] = useState<string>('')
  const [authors, setAuthors] = useState<IAuthorThumbnail[]>([])

  const { loading, data, error } = useQuery(GET_ALL_AUTHORS, {
    variables: { input: { page, name: debouncedSearchName } },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1)
      setDebouncedSearchName(searchName)
    }, 1000)
    return () => clearTimeout(handler)
  }, [searchName, debouncedSearchName])

  useEffect(() => {
    if (data?.getAuthors) {
      setAuthors(data.getAuthors)
    } else {
      setAuthors([])
    }
  }, [data])

  const handleSearchInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value)
  }, [])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  return (
    <div>
      <PageTitle title={'Authors | Hiwa'} />
      <div className="m-auto w-full px-4 xl:w-[1280px] xl:px-0">
        <div className="mt-4">
          <h1 className="mt-8 text-2xl font-bold">Authors</h1>
          <input
            type="text"
            placeholder="Search authors"
            value={searchName}
            onChange={handleSearchInputChange}
            className="my-4 w-full rounded-md border border-white/20 bg-background px-4 py-2 text-sm focus:outline-none"
          />
        </div>
        {loading ? (
          <div className="mt-4 flex justify-center">
            <LoliLoading />
          </div>
        ) : (
          <div>
            {authors.length > 0 ? (
              <>
                <div className="flex-1 rounded-lg bg-secondary-950/30 p-4">
                  <div className="flex flex-wrap gap-4">
                    {authors.map((author: IAuthorThumbnail) => (
                      <NameTag key={author.id} author={author} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-4 text-center">No authors found</div>
            )}
            <Pagination authors={authors} page={page} setPage={setPage} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Authors
