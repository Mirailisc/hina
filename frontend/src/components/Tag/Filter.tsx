import React, { useState } from 'react'

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
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div>
      <input
        type="text"
        placeholder="Search tags"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="my-4 w-full rounded-md border border-white/20 bg-background px-4 py-2 text-sm focus:outline-none"
      />
      <div className="flex flex-wrap gap-4 rounded-lg bg-secondary-950/30 p-4">
        {filteredTags.map((tag) => (
          <div
            className={`flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 font-mono text-sm text-white transition-colors duration-200 ${
              includedTags.includes(tag.id) ? 'bg-primary-700' : 'bg-secondary-950 hover:bg-secondary-800'
            }`}
            key={tag.id}
            data-cy="tag"
            onClick={() => toggleTag(tag.id)}
          >
            {tag.name}
          </div>
        ))}
        {filteredTags.length === 0 && <div className="text-sm text-gray-400">No tags found</div>}
      </div>
    </div>
  )
}

export default TagFilter
