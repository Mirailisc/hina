import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'

import remarkGfm from 'remark-gfm'

import Status from './Status'

export interface IChapter {
  id: string
  chapter: string
  volume?: string
  title?: string
  publishAt: string
}

export interface IManga {
  id: string
  title: string
  status: string
  description: string
  author: {
    id: string
    name: string
  }
  alternative: {
    en: string
    ja: string
    romaji: string
  }
  cover: string
  chapters: IChapter[]
}

type Props = {
  manga: IManga
}

const MangaInfo: React.FC<Props> = ({ manga }: Props): JSX.Element => {
  return (
    <div className="w-full rounded-lg border border-white/25 p-4">
      <h1 className="text-2xl font-bold">{manga.title}</h1>
      <Status status={manga.status} />
      <div className="mt-2 text-xs">
        {manga.alternative.en} {manga.alternative.ja} {manga.alternative.romaji}
      </div>
      <Link to={`/read/${manga.id}`}>
        <div className="my-2">Author: {manga.author.name}</div>
      </Link>
      <div className="text-white/50">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{manga.description}</ReactMarkdown>
      </div>
      {manga.chapters.length > 0 && (
        <div className="my-4 flex flex-row items-center gap-4">
          <Link
            to={`/read/${manga.id}/chapter/${manga.chapters[0]}`}
            className="rounded bg-primary-500 px-4 py-2 text-white transition hover:bg-primary-600"
          >
            Read First
          </Link>
          <Link
            to={`/read/${manga.id}/chapter/${manga.chapters[manga.chapters.length - 1]}`}
            className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
          >
            Read Last
          </Link>
        </div>
      )}
    </div>
  )
}

export default MangaInfo
