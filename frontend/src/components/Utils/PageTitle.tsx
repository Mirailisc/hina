import { useEffect } from 'react'

type Props = {
  title: string
}

const PageTitle: React.FC<Props> = ({ title }: Props): JSX.Element => {
  useEffect(() => {
    document.title = title
  }, [title])

  return <></>
}

export default PageTitle
