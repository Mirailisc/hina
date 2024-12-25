const NotFound: React.FC = (): JSX.Element => {
  return (
    <div className="flex h-[30vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Why are you here?</h1>
        <div className="mt-2 text-lg">Nothing was found at this location.</div>
      </div>
    </div>
  )
}

export default NotFound
