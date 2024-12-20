import { ApolloClient, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
  uri: import.meta.env.PROD ? '/graphql' : 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
})
