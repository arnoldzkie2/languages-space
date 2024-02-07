'use client'
import { Input } from '@/components/ui/input';
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
    const tt = useTranslations('global')

    return (
        <div className='w-full'>
            <div>
                <div className='flex w-full text-muted-foreground gap-3'>

                    <Input type="text"
                        placeholder={t('order.card')}
                        name='card'
                        onChange={handleSearch}
                        value={searchQuery.card}
                    />

                    <Input type="text"
                        placeholder={t('order.client_name')}
                        name='client_name'
                        onChange={handleSearch}
                        value={searchQuery.client_name}
                    />

                    <Input type="text"
                        placeholder={t('order.quantity')}
                        name='quantity'
                        onChange={handleSearch}
                        value={searchQuery.quantity}
                    />

                    <Input type="text"
                        placeholder={tt('price')}
                        name='price'
                        onChange={handleSearch}
                        value={searchQuery.price}
                    />

                    <Input type="text"
                        placeholder={tt('note')}
                        name='note'
                        onChange={handleSearch}
                        value={searchQuery.note}
                    />
                    <Input type="text"
                        placeholder={tt('status')}
                        name='status'
                        onChange={handleSearch}
                        value={searchQuery.status}
                    />
                    <Input type="text"
                        placeholder={t('order.invoice_number')}
                        name='invoice_number'
                        onChange={handleSearch}
                        value={searchQuery.invoice_number}
                    />
                    <Input type="text"
                        placeholder={t('order.express_number')}
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
