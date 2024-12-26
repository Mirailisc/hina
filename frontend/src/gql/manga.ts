import { gql } from '@apollo/client'

export const GET_METADATA = gql`
  query Metadata($metadataId: MetadataInput!) {
    metadata(input: $metadataId) {
      id
      title
      status
      description
      author {
        id
        name
      }
      alternative {
        en
        ja
        romaji
      }
      chapters {
        id
        title
        chapter
        volume
        translatedLanguage
        publishAt
      }
      cover
    }
  }
`

export const GET_CHAPTERS = gql`
  query Metadata($metadataId: MetadataInput!) {
    metadata(input: $metadataId) {
      chapters {
        id
        chapter
        volume
      }
    }
  }
`
