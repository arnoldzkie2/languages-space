import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import React from 'react';

interface SearchNewsProps {
    searchQuery: {
        author: string
        title: string
        keywords: string
        created_at: string
        updated_at: string
    }

    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void

}

const SearchNews: React.FC<SearchNewsProps> = ({ handleSearch, searchQuery }) => {

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <div className=''>
            <div className='flex justify-between items-center mb-2 font-medium'>
                {t('news.search')}
            </div>
            <div>
                <div className='flex flex-col gap-3'>

                    <Input type="text"
                        placeholder={t('news.title')}
                        name='title'
                        onChange={handleSearch}
                        value={searchQuery.title}
                    />

                    <Input type="text"
                        placeholder={t('news.author')}
                        name='author'
                        onChange={handleSearch}
                        value={searchQuery.author}
                    />

                    <Input type="text"
                        placeholder={t('news.keywords')}
                        name='keywords'
                        onChange={handleSearch}
                        value={searchQuery.keywords}
                    />

                    <Input type="text"
                        placeholder={tt('date')}
                        name='date'
                        onChange={handleSearch}
                        value={searchQuery.created_at}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchNews;
