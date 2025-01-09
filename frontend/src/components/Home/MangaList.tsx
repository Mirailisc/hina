import Thumbnail, { IMangaSearch } from './Thumbnail'

type Props = {
  searchResult: IMangaSearch[]
}

const MangaList: React.FC<Props> = ({ searchResult }: Props): JSX.Element => {
  return (
    <>
      {searchResult.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {searchResult
            .filter((item) => item.title !== 'Untitled')
            .map((item, index) => (
              <Thumbnail key={`manga-${index}`} data={item} />
            ))}
        </div>
      ) : (
        <div className="w-full text-center">No results found</div>
      )}
    </>
  )
}
export default MangaList
