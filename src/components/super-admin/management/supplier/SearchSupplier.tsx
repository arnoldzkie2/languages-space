'use client'
import { useTranslations } from 'next-intl';
import React, { ChangeEvent } from 'react';

interface Props {

    handleSearch: (event: ChangeEvent<HTMLInputElement>) => void

    searchQuery: {
        name: string;
        phone_number: string;
        organization: string;
        origin: string;
        note: string;
    }

}

const SearchSupplier: React.FC<Props> = ({ handleSearch, searchQuery }) => {

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <div className='pt-4 mt-4 border-t border-gray-300'>
            <div className='flex justify-between items-center mb-2 font-medium px-2'>
                {t('supplier.search')}
            </div>
            <div>
                <div className='flex flex-col text-gray-700 gap-3'>

                    <input type="text"
                        placeholder={tt('name')}
                        name='name'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.name}
                    />

                    <input type="text"
                        placeholder={tt('phone')}
                        name='phone_number'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.phone_number}
                    />

                    <input type="text"
                        placeholder={tt('organization')}
                        name='organization'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.organization}
                    />

                    <input type="text"
                        placeholder={tt('origin')}
                        name='origin'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.origin}
                    />

                    <input type="text"
                        placeholder={tt('note')}
                        name='note'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.note}
                    />

                </div>
            </div>
        </div>
    );
};

export default SearchSupplier;
