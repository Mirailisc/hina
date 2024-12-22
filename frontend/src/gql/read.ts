import { gql } from '@apollo/client'

export const READ_MANGA = gql`
  query GetChapterImages($input: ReaderInput!) {
    chapterImages(input: $input)
  }
`
