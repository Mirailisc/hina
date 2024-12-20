import { gql } from '@apollo/client'

export const GET_METADATA = gql`
  query Metadata($metadataId: MetadataInput!) {
    metadata(id: $metadataId) {
      id
      title
      status
      description
      author
      alternative {
        en
        ja
        romaji
      }
      chapters
      cover
    }
  }
`

export const GET_CHAPTERS = gql`
  query Metadata($metadataId: MetadataInput!) {
    metadata(id: $metadataId) {
      chapters
    }
  }
`

export const READ_MANGA = gql`
  query Query($input: ReaderInput!) {
    chapterImages(input: $input)
  }
`
