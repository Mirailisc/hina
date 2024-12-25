import { gql } from '@apollo/client'

export const READ_MANGA = gql`
  query GetChapterImages($input: ReaderInput!) {
    chapterImages(input: $input)
  }
`

export const FETCH_IMAGE = gql`
  query FetchImage($input: ImageInput!) {
    fetchImage(input: $input)
  }
`
