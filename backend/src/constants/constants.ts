export const MANGADEX_API = 'https://api.mangadex.org'

export const isDev = process.env.NODE_ENV === 'development'

export const contentRating = isDev
  ? ['safe', 'suggestive', 'erotica']
  : ['pornographic']

export const EXCLUDED_TAGS = [
  'b13b2a48-c720-44a9-9c77-39c9979373fb',
  '5920b825-4181-4a17-beeb-9918b0ff7a30',
]
