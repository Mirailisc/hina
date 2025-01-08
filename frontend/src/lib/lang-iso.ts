const iso639Map: { [key: string]: string } = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese', // This is the base for Chinese (zh-CN is for China, zh-TW for Taiwan, zh-HK for Hong Kong, etc.)
  ru: 'Russian',
  pt: 'Portuguese', // Base for Portuguese (pt-BR for Brazil, pt-PT for Portugal)
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
    return 'Unknown'
  }
}

export const isoCodeToFlagEmoji = (isoCode: string): string => {
  const baseCode = isoCode.split('-')[0] // Get the base language code (e.g., 'en', 'zh', 'pt')

  const countryFlagMapping: { [key: string]: string } = {
    en: '🇬🇧', // English (United Kingdom)
    es: '🇪🇸', // Spanish (Spain)
    fr: '🇫🇷', // French (France)
    de: '🇩🇪', // German (Germany)
    it: '🇮🇹', // Italian (Italy)
    ja: '🇯🇵', // Japanese (Japan)
    ko: '🇰🇷', // Korean (South Korea)
    zh: '🇨🇳', // Chinese (General, for regions like Mainland China, Taiwan, Hong Kong, etc.)
    ru: '🇷🇺', // Russian (Russia)
    pt: '🇧🇷', // Portuguese (Brazil by default)
    ar: '🇸🇦', // Arabic (Saudi Arabia)
    hi: '🇮🇳', // Hindi (India)
    bn: '🇧🇩', // Bengali (Bangladesh)
    pa: '🇮🇳', // Punjabi (India)
    gu: '🇮🇳', // Gujarati (India)
    ta: '🇮🇳', // Tamil (India)
    tr: '🇹🇷', // Turkish (Turkey)
    vi: '🇻🇳', // Vietnamese (Vietnam)
    pl: '🇵🇱', // Polish (Poland)
    uk: '🇺🇦', // Ukrainian (Ukraine)
    ro: '🇷🇴', // Romanian (Romania)
    cs: '🇨🇿', // Czech (Czech Republic)
    sk: '🇸🇰', // Slovak (Slovakia)
    nl: '🇳🇱', // Dutch (Netherlands)
    sv: '🇸🇪', // Swedish (Sweden)
    no: '🇳🇴', // Norwegian (Norway)
    da: '🇩🇰', // Danish (Denmark)
    fi: '🇫🇮', // Finnish (Finland)
    el: '🇬🇷', // Greek (Greece)
    he: '🇮🇱', // Hebrew (Israel)
    th: '🇹🇭', // Thai (Thailand)
    ms: '🇲🇾', // Malay (Malaysia)
    id: '🇮🇩', // Indonesian (Indonesia)
    ml: '🇮🇳', // Malayalam (India)
    kn: '🇮🇳', // Kannada (India)
    mr: '🇮🇳', // Marathi (India)
  }

  // Return the corresponding flag for the base code, or a default rainbow flag if none exists
  return countryFlagMapping[baseCode] || '🏳️‍🌈' // Default to rainbow flag if no match
}
