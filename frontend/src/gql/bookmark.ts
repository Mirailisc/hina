import { gql } from '@apollo/client'

export const GET_BOOKMARKS = gql`
  query GetBookmarks {
    getBookmarks {
      id
      manga {
        id
        title
        status
        cover
      }
      currentChapter
      currentLanguage
    }
  }
`

export const GET_BOOKMARK = gql`
  query GetBookmark($mangaId: String!) {
    getBookmark(mangaId: $mangaId) {
      id
      manga {
        id
        title
        status
        cover
      }
      currentChapter
      currentLanguage
    }
  }
`

export const CREATE_BOOKMARK = gql`
  mutation CreateBookmark($input: CreateBookmarkInput!) {
    createBookmark(input: $input)
  }
`

export const DELETE_BOOKMARK = gql`
  mutation DeleteBookmark($bookmarkId: String!) {
    deleteBookmark(bookmarkId: $bookmarkId)
  }
`

export const UPDATE_BOOKMARK = gql`
  mutation UpdateBookmark($bookmarkId: String!, $currentChapter: String!, $currentLanguage: String!) {
    updateBookmark(bookmarkId: $bookmarkId, currentChapter: $currentChapter, currentLanguage: $currentLanguage)
  }
`
