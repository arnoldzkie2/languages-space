'use client'
import { useTranslations } from 'next-intl';
import React, { ChangeEvent } from 'react';

interface Props {

    handleSearch: (event: ChangeEvent<HTMLInputElement>) => void

    searchQuery: {
        name: string;
        price: string
        validity: string;
        balance: string
    }

}

const SearchClientCard: React.FC<Props> = ({ handleSearch, searchQuery }) => {

    const t = useTranslations('super-admin')

    return (
        <div className='w-full'>
            <div className='flex justify-between items-center mb-2 font-medium px-2'>
                {t('client-card.search')}
            </div>
            <div>
                <div className='flex flex-col text-gray-700 gap-3'>

                    <input type="text"
                        placeholder={t('client-card.name')}
                        name='name'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.name}
                    />

                    <input
                        placeholder={t('client-card.price')}
                        name='price'
                        type='number'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.price ? searchQuery.price : ''}
                    />

                    <input
                        placeholder={t('client-card.balance')}
                        name='balance'
                        type='number'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.balance ? searchQuery.balance : ''}
                    />

                    <input type="text"
                        placeholder={t('client-card.validity')}
                        name='validity'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.validity}
                    />

                </div>
            </div>
        </div>
    );
};

export default SearchClientCard;
