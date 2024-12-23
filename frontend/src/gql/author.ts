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

export const GET_AUTHOR_INFO = gql`
  query GetAuthorInfo($input: AuthorInput!) {
    getAuthorInfo(input: $input) {
      id
      mangas {
        id
        title
        status
        cover
        totalPage
      }
      name
      social {
        twitter
        pixiv
        melonBook
        fanBox
        nicoVideo
        fantia
        tumblr
        youtube
        weibo
        website
      }
    }
  }
`
