import { gql } from '@apollo/client'

export const READ_MANGA = gql`
  query GetChapterImages($input: ReaderInput!) {
    chapterImages(input: $input)
  }
`

export const FETCH_IMAGE_WITHOUT_CACHE = gql`
  query FetchImage($input: ImageInput!) {
    fetchImageWithoutCache(input: $input)
  }
`

export const FETCH_IMAGE_WITH_CACHE = gql`
  query FetchImage($input: ImageInput!) {
    fetchImageWithCache(input: $input)
  }
`
