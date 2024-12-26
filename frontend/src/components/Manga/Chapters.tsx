import { FaRegClock } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import moment from 'moment'

import { isoCodeToFlagEmoji } from '@lib/lang-iso'

import { READER_PATH } from '@constants/routes'

import { IChapter } from './Info'

type Props = {
  id: string
  chapters: IChapter[]
  selectedLanguage: string
}

const MangaChapters: React.FC<Props> = ({ id, chapters, selectedLanguage }: Props): JSX.Element => {
  return (
    <div>
      {chapters.map((chapter, index) => {
        return (
          <Link
            to={{
              pathname: READER_PATH.replace(':id', id).replace(':chapterId', chapter.id),
              search: selectedLanguage === 'All' ? '' : `?lang=${selectedLanguage}`,
            }}
            key={`chapter-${chapter.chapter}-${index}-${chapter.translatedLanguage}`}
          >
            <div className="mt-4 rounded-lg bg-white/10 px-4 py-2 transition-colors duration-200 hover:bg-white/20">
              <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start md:gap-0">
                <div>
                  <div className="text-white">
                    {isoCodeToFlagEmoji(chapter.translatedLanguage)} {chapter.volume ? `Vol. ${chapter.volume} ` : ''}{' '}
                    Ch. {chapter.chapter}
                  </div>
                  {chapter.title && <div className="text-white">{chapter.title}</div>}
                </div>
                <div className="flex flex-row items-center justify-end gap-2">
                  <FaRegClock />
                  {moment(chapter.publishAt).fromNow()}
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default MangaChapters
