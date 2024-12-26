export interface ITag {
  id: string
  name: string
}

type Props = {
  tags: ITag[]
  includedTags: string[]
  toggleTag: (tagId: string) => void
}

const TagFilter: React.FC<Props> = ({ tags, includedTags, toggleTag }: Props): JSX.Element => {
  return (
    <div className="my-4 flex flex-wrap gap-4">
      {tags.map((tag) => (
        <div
          className={`flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 ${
            includedTags.includes(tag.id) ? 'bg-primary-700 text-white' : 'bg-white/30'
          }`}
          key={tag.id}
          onClick={() => toggleTag(tag.id)}
        >
          {tag.name}
        </div>
      ))}
    </div>
  )
}

export default TagFilter
