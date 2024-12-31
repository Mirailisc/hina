export const MANGADEX_API = 'https://api.mangadex.org'

export const isDev = process.env.NODE_ENV === 'development'

export const contentRating = isDev ? ['safe', 'suggestive'] : ['pornographic']
