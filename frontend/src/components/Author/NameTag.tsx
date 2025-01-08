import { Link } from 'react-router-dom'

import { AUTHOR_PATH } from '@constants/routes'

export interface IAuthorThumbnail {
  id: string
  name: string
  totalPage: number
}

type Props = {
  author: IAuthorThumbnail
}

const NameTag: React.FC<Props> = ({ author }: Props): JSX.Element => {
  return (
    <Link to={AUTHOR_PATH.replace(':id', author.id)}>
      <div className="rounded-md bg-secondary-950 px-4 py-2 font-mono text-sm transition-colors duration-200 hover:bg-secondary-800">
        {author.name}
      </div>
    </Link>
  )
}

export default NameTag
