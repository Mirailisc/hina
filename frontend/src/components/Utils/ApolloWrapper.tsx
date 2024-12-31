import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

import { ACCESS_TOKEN } from '@constants/cookie'

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { ApolloProvider } from '@apollo/client/react'

type Props = {
  children: React.ReactNode
}

const ApolloWrapper: React.FC<Props> = ({ children }) => {
  const [cookies] = useCookies([ACCESS_TOKEN])
  const [client, setClient] = useState<ApolloClient<any> | null>(null)

  useEffect(() => {
    const token = cookies[ACCESS_TOKEN]

    const httpLink = createHttpLink({
      uri: import.meta.env.PROD ? '/graphql' : 'http://localhost:4000/graphql',
    })

    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : '',
        },
      }
    })

    const newClient = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    })

    setClient(newClient)
  }, [cookies])

  if (!client) return null

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default ApolloWrapper
