'use client'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const SearchCard: React.FC<Props> = ({ handleSearch, searchQuery }) => {

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <div className='pt-2 w-full'>
            <Label className='flex justify-between items-center mb-2 font-medium px-2'>
                {t('client-card.search')}
            </Label>
            <div>
                <div className='flex flex-col gap-3'>

                    <Input type="text"
                        placeholder={tt('name')}
                        name='name'
                        onChange={handleSearch}
                        value={searchQuery.name}
                    />

                    <Input
                        placeholder={tt('price')}
                        name='price'
                        type='number'
                        onChange={handleSearch}
                        value={searchQuery.price ? searchQuery.price : ''}
                    />

                    <Input
                        placeholder={tt('balance')}
                        name='balance'
                        type='number'
                        onChange={handleSearch}
                        value={searchQuery.balance ? searchQuery.balance : ''}
                    />

                    <Input type="text"
                        placeholder={t('client-card.validity')}
                        name='validity'
                        onChange={handleSearch}
                        value={searchQuery.validity}
                    />

                </div>
            </div>
        </div>
    );
};

export default SearchCard;
