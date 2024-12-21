import { createContext, Dispatch, SetStateAction } from 'react'

export interface SearchParameter {
  name: string
  amount: number
}

export const searchContextDefaultValues: SearchParameter = {
  name: '',
  amount: 96,
}

export const SearchContext = createContext<{
  search: SearchParameter
  setSearch: Dispatch<SetStateAction<SearchParameter>>
}>({
  search: searchContextDefaultValues,
  setSearch: () => {},
})
