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
  const baseCode = isoCode.split('-')[0];

  const countryFlagMapping: { [key: string]: string } = {
    en: '&#x1F1EC;&#x1F1E7;', // 🇬🇧
    es: '&#x1F1EA;&#x1F1F8;', // 🇪🇸
    fr: '&#x1F1EB;&#x1F1F7;', // 🇫🇷
    de: '&#x1F1E9;&#x1F1EA;', // 🇩🇪
    it: '&#x1F1EE;&#x1F1F9;', // 🇮🇹
    ja: '&#x1F1EF;&#x1F1F5;', // 🇯🇵
    ko: '&#x1F1F0;&#x1F1F7;', // 🇰🇷
    zh: '&#x1F1E8;&#x1F1F3;', // 🇨🇳
    ru: '&#x1F1F7;&#x1F1FA;', // 🇷🇺
    pt: '&#x1F1F5;&#x1F1F9;', // 🇵🇹
    ar: '&#x1F1F8;&#x1F1E6;', // 🇸🇦
    hi: '&#x1F1EE;&#x1F1F3;', // 🇮🇳
    bn: '&#x1F1E7;&#x1F1E9;', // 🇧🇩
    pa: '&#x1F1EE;&#x1F1F3;', // 🇮🇳
    gu: '&#x1F1EE;&#x1F1F3;', // 🇮🇳
    ta: '&#x1F1EE;&#x1F1F3;', // 🇮🇳
    tr: '&#x1F1F9;&#x1F1F7;', // 🇹🇷
    vi: '&#x1F1FB;&#x1F1F3;', // 🇻🇳
    pl: '&#x1F1F5;&#x1F1F1;', // 🇵🇱
    uk: '&#x1F1EC;&#x1F1E7;', // 🇬🇧
    ro: '&#x1F1F7;&#x1F1F4;', // 🇷🇴
    cs: '&#x1F1E8;&#x1F1FF;', // 🇨🇿
    sk: '&#x1F1F8;&#x1F1F0;', // 🇸🇰
    nl: '&#x1F1F3;&#x1F1F1;', // 🇳🇱
    sv: '&#x1F1F8;&#x1F1EA;', // 🇸🇪
    no: '&#x1F1F3;&#x1F1F4;', // 🇳🇴
    da: '&#x1F1E9;&#x1F1F0;', // 🇩🇰
    fi: '&#x1F1EB;&#x1F1EE;', // 🇫🇮
    el: '&#x1F1EC;&#x1F1F7;', // 🇬🇷
    he: '&#x1F1EE;&#x1F1F1;', // 🇮🇱
    th: '&#x1F1F9;&#x1F1ED;', // 🇹🇭
    ms: '&#x1F1F2;&#x1F1FE;', // 🇲🇾
    id: '&#x1F1EE;&#x1F1E9;', // 🇮🇩
    ml: '&#x1F1EE;&#x1F1F3;', // 🇮🇳
    kn: '&#x1F1EE;&#x1F1F3;', // 🇮🇳
    mr: '&#x1F1EE;&#x1F1F3;', // 🇮🇳
  };

  return countryFlagMapping[baseCode] || '&#x1F3F3;&#xFE0F;&#x200D;&#x1F308;'; // 🏳️‍🌈
};
