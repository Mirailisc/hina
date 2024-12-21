import { Link } from 'react-router-dom'

import { READER_PATH } from '@constants/routes'

type Props = {
  id: string
  chapters: string[]
  order: 'asc' | 'desc'
}

const MangaChapters: React.FC<Props> = ({ id, chapters, order }: Props): JSX.Element => {
  return (
    <div>
      {chapters.map((chapter, index) => {
        const chapterIndex = order === 'asc' ? index + 1 : chapters.length - index

        return (
          <Link
            to={{
              pathname: READER_PATH.replace(':id', id).replace(':chapterId', chapter),
            }}
            key={index}
          >
            <div className="mt-4 rounded-lg bg-white/10 p-2 transition-colors duration-200 hover:bg-white/20">
              <div className="text-white">Chapter {chapterIndex}</div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default MangaChapters
