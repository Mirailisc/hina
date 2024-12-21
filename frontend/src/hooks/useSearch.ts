import { useContext } from 'react'

import { SearchContext } from '@context/searchContext'

export const useSearch = () => useContext(SearchContext)
