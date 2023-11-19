'use client'
import { useTranslations } from 'next-intl';
import React, { ChangeEvent } from 'react';

interface Props {

    handleSearch: (event: ChangeEvent<HTMLInputElement>) => void

    searchQuery: {
        name: string;
        operator: string;
        price: string;
        status: string;
        client: string;
        supplier: string;
        schedule: string;
        note: string;
    }

}

const SearchBooking: React.FC<Props> = ({ handleSearch, searchQuery }) => {

    const t = useTranslations('super-admin')

    return (
        <div className='w-full'>

            <div>
                <div className='flex w-full text-gray-700 gap-3'>

                    <input type="text"
                        placeholder={t('client-card.name')}
                        name='name'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.name}
                    />

                    <input type="text"
                        placeholder={t('booking.client')}
                        name='client'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.client}
                    />

                    <input type="text"
                        placeholder={t('booking.supplier')}
                        name='supplier'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.supplier}
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
                        value={searchQuery.note ? searchQuery.note : ''}
                    />

                    <input type="text"
                        placeholder={t('client-card.validity')}
                        name='validity'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.operator}
                    />

                </div>
            </div>
        </div>
    );
};

export default SearchBooking;
