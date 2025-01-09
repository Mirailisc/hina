export const BASE_PATH = '/'
export const BROWSE_PATH = BASE_PATH + 'pages/:page'

export const AUTHORS_PATH = BASE_PATH + 'authors/'
export const AUTHOR_PATH = AUTHORS_PATH + ':id'

export const TAGS_PATH = BASE_PATH + 'tags/'

export const SEARCH_PATH = BASE_PATH + 'search/:name'

export const MANGA_PATH = BASE_PATH + 'read/:id/'
export const READER_PATH = MANGA_PATH + 'chapter/:chapterId'

export const SIGN_UP_PATH = BASE_PATH + 'register'
export const SIGN_IN_PATH = BASE_PATH + 'login'
