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

    const t = useTranslations()

    return (
        <div className='pt-2 w-full'>
            <Label className='flex justify-between items-center mb-2 font-medium px-2'>
                {t('card.search')}
            </Label>
            <div>
                <div className='flex flex-col gap-3'>

                    <Input type="text"
                        placeholder={t('info.name')}
                        name='name'
                        onChange={handleSearch}
                        value={searchQuery.name}
                    />

                    <Input
                        placeholder={t('card.price')}
                        name='price'
                        type='number'
                        onChange={handleSearch}
                        value={searchQuery.price ? searchQuery.price : ''}
                    />

                    <Input
                        placeholder={t('balance.h1')}
                        name='balance'
                        type='number'
                        onChange={handleSearch}
                        value={searchQuery.balance ? searchQuery.balance : ''}
                    />

                    <Input type="text"
                        placeholder={t('card.validity')}
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
