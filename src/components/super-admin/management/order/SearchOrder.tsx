'use client'
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import React, { ChangeEvent } from 'react';

interface Props {

    handleSearch: (event: ChangeEvent<HTMLInputElement>) => void

    searchQuery: {
        name: string;
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

    const t = useTranslations()

    return (
        <div className='w-full'>
            <div>
                <div className='flex w-full text-muted-foreground gap-3'>

                    <Input type="text"
                        placeholder={t('info.name')}
                        name='name'
                        onChange={handleSearch}
                        value={searchQuery.name}
                    />

                    <Input type="text"
                        placeholder={t('side_nav.client')}
                        name='client_name'
                        onChange={handleSearch}
                        value={searchQuery.client_name}
                    />

                    <Input type="text"
                        placeholder={t('info.quantity')}
                        name='quantity'
                        onChange={handleSearch}
                        value={searchQuery.quantity}
                    />

                    <Input type="text"
                        placeholder={t('card.price')}
                        name='price'
                        onChange={handleSearch}
                        value={searchQuery.price}
                    />

                    <Input type="text"
                        placeholder={t('info.note')}
                        name='note'
                        onChange={handleSearch}
                        value={searchQuery.note}
                    />
                    <Input type="text"
                        placeholder={t('status.h1')}
                        name='status'
                        onChange={handleSearch}
                        value={searchQuery.status}
                    />
                    <Input type="text"
                        placeholder={t('card.invoice')}
                        name='invoice_number'
                        onChange={handleSearch}
                        value={searchQuery.invoice_number}
                    />
                    <Input type="text"
                        placeholder={t('card.express')}
                        name='express_number'
                        onChange={handleSearch}
                        value={searchQuery.express_number}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchOrder;
