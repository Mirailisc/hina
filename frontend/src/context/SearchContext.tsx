import React, { createContext, useState, useContext, Dispatch, SetStateAction } from 'react'

interface SearchParameter {
  name: string
  amount: number
}

const initialValues: SearchParameter = {
  name: '',
  amount: 96,
}

const SearchContext = createContext<{
  search: SearchParameter
  setSearch: Dispatch<SetStateAction<SearchParameter>>
}>({
  search: initialValues,
  setSearch: () => {},
})

type Props = {
  children: React.ReactNode
}

export const SearchProvider: React.FC<Props> = ({ children }) => {
  const [search, setSearch] = useState<SearchParameter>(initialValues)

  return <SearchContext.Provider value={{ search, setSearch }}>{children}</SearchContext.Provider>
}

export const useSearch = () => useContext(SearchContext)
