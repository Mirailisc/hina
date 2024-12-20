import { gql } from '@apollo/client'

export const SEARCH_MANGA = gql`
  query search($input: SearchInput!) {
    searchMetadata(input: $input) {
      id
      title
      status
      cover
    }
  }
`
