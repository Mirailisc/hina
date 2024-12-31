import { gql } from '@apollo/client'

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      id
      username
      createdAt
    }
  }
`

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`

export const PROFILE = gql`
  query Profile {
    profile {
      id
      username
      createdAt
    }
  }
`
