import { RootState } from '@/lib/redux/Store';
import React from 'react';
import { useSelector } from 'react-redux';

interface SearchNewsProps {
    searchQuery: {
        author: string
        title: string
        keywords: string
        date: string
    }

    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void

}

const SearchNews: React.FC<SearchNewsProps> = ({ handleSearch, searchQuery }) => {

    const { totalNews } = useSelector((state: RootState) => state.manageWeb)

    return (
        <div className=''>
            <div className='flex justify-between items-center mb-2 font-medium px-2'>
                Search News
            </div>
            <div>
                <div className='flex flex-col text-gray-700 gap-3'>

                    <input type="text"
                        placeholder='Title'
                        name='title'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.title}
                    />

                    <input type="text"
                        placeholder='Author'
                        name='author'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.author}
                    />

                    <input type="text"
                        placeholder='Keywords'
                        name='keywords'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.keywords}
                    />

                    <input type="text"
                        placeholder='Date'
                        name='date'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.date}
                    />

                    <div className='flex flex-col px-3 pt-3 mt-2 border-t'>
                        <div className='font-medium mb-1'>Result: <span className='text-sm font-black text-gray-600'>{totalNews.searched}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchNews;
