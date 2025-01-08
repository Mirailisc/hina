import { getLanguageName } from '@/lib/lang-iso'

type Props = {
  selectedLanguage: string
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>
  languages: string[]
}

const LanguageTab: React.FC<Props> = ({ selectedLanguage, setSelectedLanguage, languages }: Props): JSX.Element => {
  return (
    <div className="mt-4 overflow-x-auto">
      <h1 className="text-2xl font-bold">Languages</h1>
      <ul className="my-4 flex space-x-4">
        {languages
          .filter((lang) => getLanguageName(lang) !== 'Unknown' || lang === 'All')
          .map((lang) => (
            <li
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`cursor-pointer px-4 py-2 ${
                selectedLanguage === lang ? 'border-b-2 border-white text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {lang === 'All' ? 'All' : getLanguageName(lang)}
            </li>
          ))}
      </ul>
    </div>
  )
}

export default LanguageTab
