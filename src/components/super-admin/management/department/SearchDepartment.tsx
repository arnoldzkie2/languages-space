'use client'
import { useTranslations } from 'next-intl';
import React, { ChangeEvent } from 'react';

interface Props {

    setSearchQuery: React.Dispatch<React.SetStateAction<string>>

    searchQuery: string

}

const SearchDepartment: React.FC<Props> = ({  searchQuery, setSearchQuery }) => {

    const t = useTranslations('super-admin')

    return (
        <div className='w-full'>
            <div className='flex justify-between items-center mb-2 font-medium px-2'>
                {t('department.search')}
            </div>
            <div>
                <div className='flex flex-col text-gray-700 gap-3'>

                    <input type="text"
                        placeholder={t('client-card.name')}
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchDepartment;
