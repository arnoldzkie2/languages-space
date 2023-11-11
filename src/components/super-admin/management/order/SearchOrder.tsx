'use client'
import { useTranslations } from 'next-intl';
import React, { ChangeEvent } from 'react';

interface Props {

    handleSearch: (event: ChangeEvent<HTMLInputElement>) => void

    searchQuery: {
        card: string;
        client_name: string;
        quantity: string;
        price: string;
        operator: string
        status: string
        invoice_number: string
        express_number: string
        date: string
        note: string;
    }
}

const SearchOrder: React.FC<Props> = ({ handleSearch, searchQuery }) => {

    const t = useTranslations('super-admin')

    return (
        <div className='border-gray-300 w-full'>
            <div>
                <div className='flex w-full text-gray-700 gap-3'>

                    <input type="text"
                        placeholder={t('order.card')}
                        name='card'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.card}
                    />

                    <input type="text"
                        placeholder={t('order.client_name')}
                        name='client_name'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.client_name}
                    />

                    <input type="text"
                        placeholder={t('order.quantity')}
                        name='quantity'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.quantity}
                    />

                    <input type="text"
                        placeholder={t('order.price')}
                        name='price'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.price}
                    />

                    <input type="text"
                        placeholder={t('order.note')}
                        name='note'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.note}
                    />
                    <input type="text"
                        placeholder={t('order.status')}
                        name='status'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.status}
                    />
                    <input type="text"
                        placeholder={t('order.invoice_number')}
                        name='invoice_number'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.invoice_number}
                    />
                    <input type="text"
                        placeholder={t('order.express_number')}
                        name='express_number'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.express_number}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchOrder;
