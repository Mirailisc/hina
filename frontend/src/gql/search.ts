import { gql } from '@apollo/client'

export const SEARCH_MANGA = gql`
  query MangaSearch($input: SearchInput!) {
    searchMetadata(input: $input) {
      id
      title
      status
      cover
    }
  }
`
