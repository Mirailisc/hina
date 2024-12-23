import { AUTHOR_PATH } from '@constants/routes'
import { Link } from 'react-router-dom'

export interface IAuthorThumbnail {
  id: string
  name: string
  totalPage: number
}

type Props = {
  author: IAuthorThumbnail
}

const Thumbnail: React.FC<Props> = ({ author }: Props): JSX.Element => {
  return (
    <Link to={AUTHOR_PATH.replace(':id', author.id)}>
      <div className="rounded-md bg-white/30 px-4 py-2">{author.name}</div>
    </Link>
  )
}

export default Thumbnail
