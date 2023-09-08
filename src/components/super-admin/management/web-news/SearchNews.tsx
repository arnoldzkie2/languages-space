import { useTranslations } from 'next-intl';
import React from 'react';

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

    const t = useTranslations('super-admin')

    return (
        <div className=''>
            <div className='flex justify-between items-center mb-2 font-medium'>
                {t('news.search')}
            </div>
            <div>
                <div className='flex flex-col text-gray-700 gap-3'>

                    <input type="text"
                        placeholder={t('news.title')}
                        name='title'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.title}
                    />

                    <input type="text"
                        placeholder={t('news.author')}
                        name='author'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.author}
                    />

                    <input type="text"
                        placeholder={t('news.keywords')}
                        name='keywords'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.keywords}
                    />

                    <input type="text"
                        placeholder={t('news.date')}
                        name='date'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.date}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchNews;
