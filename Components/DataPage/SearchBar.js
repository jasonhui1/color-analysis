import { IoSearchOutline } from "react-icons/io5";
import { CiCircleRemove } from "react-icons/ci";

export const SearchBar = ({ searchTerm, setSearchTerm, onSearch }) => {
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !searchTerm) {
      onSearch();
    }
  };

  return (

    <div className='flex gap-2 items-center border bg-gray-100 w-fit p-2 '>
      <IoSearchOutline size={20} onClick={onSearch} cursor='pointer' />
      <input className=' bg-inherit w-96 outline-none ' type='text' value={searchTerm} placeholder='Search Tags' onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyPress} />
      {searchTerm && <CiCircleRemove size={20} cursor='pointer' onClick={() => { setSearchTerm(''); }} />}
    </div>
  );
};
