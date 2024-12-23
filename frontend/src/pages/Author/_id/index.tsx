import { useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'

import { GET_ALL_AUTHORS } from '@gql/author'

import { useQuery } from '@apollo/client'

const Authors: React.FC = (): JSX.Element => {
  const { id } = useParams()

  const [page, setPage] = useState<number>(1)
  const { loading, data, error } = useQuery(GET_ALL_AUTHORS, {
    variables: { input: { id: id, mangaPage: page } },
  })

  if (loading) return <div>Loading...</div>
  if (error) toast.error(error.message)

  return <div>{JSON.stringify(data, null, 2)}</div>
}

export default Authors
