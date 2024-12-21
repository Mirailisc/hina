import { gql } from '@apollo/client'

export const READ_MANGA = gql`
  query Query($input: ReaderInput!) {
    chapterImages(input: $input)
  }
`
