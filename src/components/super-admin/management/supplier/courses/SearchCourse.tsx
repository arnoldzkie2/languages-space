'use client'

import { useTranslations } from 'next-intl';
import React, { ChangeEvent } from 'react';

interface Props {

    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
    searchQuery: string

}

const SearchCourse: React.FC<Props> = ({ setSearchQuery, searchQuery }) => {

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')
    return (
        <div className='pt-4 mt-4 border-t border-gray-300'>
            <div className='flex justify-between items-center mb-2 font-medium px-2'>
                {t('courses.search')}
            </div>
            <div>
                <div className='flex flex-col text-gray-700 gap-3'>

                    <input type="text"
                        placeholder={tt('name')}
                        name='name'
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='w-full border text-sm px-3 outline-none py-2'
                        value={searchQuery}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchCourse;
