const iso639Map: { [key: string]: string } = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  ru: 'Russian',
  pt: 'Portuguese',
  ar: 'Arabic',
  hi: 'Hindi',
  bn: 'Bengali',
  pa: 'Punjabi',
  gu: 'Gujarati',
  ta: 'Tamil',
  tr: 'Turkish',
  vi: 'Vietnamese',
  pl: 'Polish',
  uk: 'Ukrainian',
  ro: 'Romanian',
  cs: 'Czech',
  sk: 'Slovak',
  nl: 'Dutch',
  sv: 'Swedish',
  no: 'Norwegian',
  da: 'Danish',
  fi: 'Finnish',
  el: 'Greek',
  he: 'Hebrew',
  th: 'Thai',
  ms: 'Malay',
  id: 'Indonesian',
  ml: 'Malayalam',
  kn: 'Kannada',
  mr: 'Marathi',
}

export const getLanguageName = (isoCode: string): string => {
  const parts = isoCode.split('-')
  const fullMatch = iso639Map[isoCode]
  const baseMatch = iso639Map[parts[0]]

  if (fullMatch) {
    return fullMatch
  } else if (baseMatch) {
    return baseMatch
  } else {
    return 'Unknown Language'
  }
}

export const isoCodeToFlagEmoji = (isoCode: string): string => {
  const baseCode = isoCode.split('-')[0]

  const countryFlagMapping: { [key: string]: string } = {
    en: '🇬🇧',
    es: '🇪🇸',
    fr: '🇫🇷',
    de: '🇩🇪',
    it: '🇮🇹',
    ja: '🇯🇵',
    ko: '🇰🇷',
    zh: '🇨🇳',
    ru: '🇷🇺',
    pt: '🇵🇹',
    ar: '🇸🇦',
    hi: '🇮🇳',
    bn: '🇧🇩',
    pa: '🇮🇳',
    gu: '🇮🇳',
    ta: '🇮🇳',
    tr: '🇹🇷',
    vi: '🇻🇳',
    pl: '🇵🇱',
    uk: '🇬🇧',
    ro: '🇷🇴',
    cs: '🇨🇿',
    sk: '🇸🇰',
    nl: '🇳🇱',
    sv: '🇸🇪',
    no: '🇳🇴',
    da: '🇩🇰',
    fi: '🇫🇮',
    el: '🇬🇷',
    he: '🇮🇱',
    th: '🇹🇭',
    ms: '🇲🇾',
    id: '🇮🇩',
    ml: '🇮🇳',
    kn: '🇮🇳',
    mr: '🇮🇳',
  }

  return countryFlagMapping[baseCode] || '🏳️‍🌈'
}
