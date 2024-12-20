import { Mosaic } from 'react-loading-indicators'

const Loading: React.FC = (): JSX.Element => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Mosaic color="#0A81AB" size="large" />
    </div>
  )
}

export default Loading
