import { useState } from 'react'

import { SearchContext, SearchParameter, searchContextDefaultValues } from '../searchContext'

type Props = {
  children: React.ReactNode
}

export const SearchProvider: React.FC<Props> = ({ children }: Props) => {
  const [search, setSearch] = useState<SearchParameter>(searchContextDefaultValues)

  return <SearchContext.Provider value={{ search, setSearch }}>{children}</SearchContext.Provider>
}
