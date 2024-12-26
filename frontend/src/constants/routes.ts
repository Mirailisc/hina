export const BASE_PATH = '/'
export const BASE_PATH_WITH_PAGE = BASE_PATH + 'pages/:page'

export const AUTHORS_PATH = BASE_PATH + 'authors/'
export const AUTHOR_PATH = AUTHORS_PATH + ':id'

export const TAGS_PATH = BASE_PATH + 'tags/'

export const SEARCH_PATH = BASE_PATH + 'search/'
export const MANGA_NAME_SEARCH_PATH = SEARCH_PATH + ':name'

export const MANGA_PATH = BASE_PATH + 'read/:id/'
export const READER_PATH = MANGA_PATH + 'chapter/:chapterId'
