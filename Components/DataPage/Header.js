import Link from '@/node_modules/next/link';
import useTags from '@/hooks/useTags';
import { useTagSuggestion } from '@/hooks/useTagSuggestion';
import { TagsSuggestion } from '@/Components/Form/TagsSuggestion';
import { TagsDisplay } from '@/Components/Form/TagsDisplay';
import { SearchBar } from './SearchBar';


export function Header({ tags, setTags, searchTerm, onSearch, setSearchTerm }) {

  const { tags: all_tags, loading: loadingTags } = useTags()
  const { suggestions, selectedIndex, onKeyDown, onClickSuggestion } = useTagSuggestion({
    input: searchTerm, setInput: setSearchTerm,
    all_tags, currentTags: tags, setCurrentTags: setTags
  })

  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag))
  }

  return (
    <div className='w-full flex justify-center sticky top-0 z-10 bg-white bg-opacity-80'>
      <div className='flex-1 flex justify-center' onKeyDown={onKeyDown}>
        <div className="flex flex-col gap-2 relative" >
          <div className="flex flex-wrap gap-2 mb-2">

            <TagsDisplay tags={tags} onRemove={removeTag} />
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={onSearch} />
          </div>
          <TagsSuggestion suggestions={suggestions} selectedIndex={selectedIndex} onClickSuggestion={onClickSuggestion} className='top-12' />
        </div>
      </div>
      <Link href='/' className='text-blue-500 hover:text-blue-700 bg-gray-200 px-2 py-1 rounded-md self-center'>Upload</Link>
    </div>
  );
}



