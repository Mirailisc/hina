import { useCookies } from 'react-cookie'

import { ACCESS_TOKEN } from '@/constants/cookie'

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: import.meta.env.PROD ? '/graphql' : 'http://localhost:4000/graphql',
})

const authLink = setContext((_, { headers }) => {
  const [cookies] = useCookies([ACCESS_TOKEN])
  const token = cookies[ACCESS_TOKEN]

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
