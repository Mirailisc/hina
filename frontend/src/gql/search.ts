import { gql } from '@apollo/client'

export const SEARCH_MANGA = gql`
  query MangaSearch($input: SearchInput!) {
    searchMetadata(input: $input) {
      id
      title
      status
      cover
      totalPage
    }
  }
`

export const SEARCH_MANGA_BY_TAGS = gql`
  query GetTags($input: SearchTagsInput!) {
    searchByTags(input: $input) {
      id
      title
      status
      cover
      totalPage
    }
  }
`
