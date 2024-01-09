'use client'
import { useTranslations } from 'next-intl';
import React, { ChangeEvent } from 'react';

interface Props {

    handleSearch: (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => void

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
    const tt = useTranslations('global')

    return (
        <div className='w-full'>

            <div>
                <div className='flex w-full text-gray-700 gap-3'>

                    <input type="text"
                        placeholder={tt('name')}
                        name='name'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.name}
                    />

                    <input type="text"
                        placeholder={tt('client')}
                        name='client'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.client}
                    />

                    <input type="text"
                        placeholder={tt('supplier')}
                        name='supplier'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.supplier}
                    />

                    <input
                        placeholder={tt('price')}
                        name='price'
                        type='number'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.price}
                    />

                    <input
                        placeholder={tt('note')}
                        name='note'
                        type='text'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.note}
                    />

                    <select className='px-3 w-full border py-2 rounded-md outline-none' value={searchQuery.operator} onChange={handleSearch} name='operator'>
                        <option value="">{tt("operator")}</option>
                        <option value="client">{tt('client')}</option>
                        <option value="supplier">{tt('supplier')}</option>
                        <option value="admin">{tt('admin')}</option>
                    </select>

                    <select className='px-3 w-full border py-2 rounded-md outline-none' value={searchQuery.status} onChange={handleSearch} name='status'>
                        <option value="">{tt("status")}</option>
                        <option value="confirmed">{tt('confirmed')}</option>
                        <option value="canceled">{tt('canceled')}</option>
                        <option value="cancel-request">{tt('cancel-request')}</option>
                    </select>

                </div>
            </div>
        </div>
    );
};

export default SearchBooking;
