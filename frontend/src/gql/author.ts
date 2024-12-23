import { gql } from '@apollo/client'

export const GET_ALL_AUTHORS = gql`
  query GetAuthors($input: AuthorsInput!) {
    getAuthors(input: $input) {
      id
      name
      totalPage
    }
  }
`
