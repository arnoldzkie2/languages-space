'use client'
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
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

    setSearchQuery: React.Dispatch<React.SetStateAction<{
        name: string;
        operator: string;
        price: string;
        status: string;
        client: string;
        supplier: string;
        schedule: string;
        note: string;
    }>>
}

const SearchBooking: React.FC<Props> = ({ handleSearch, searchQuery, setSearchQuery }) => {

    const t = useTranslations()

    return (
        <div className='flex w-full gap-3'>

            <Input type="text"
                placeholder={t('info.name')}
                name='name'
                className='w-full border text-sm px-3 outline-none py-2'
                onChange={handleSearch}
                value={searchQuery.name}
            />

            <Input type="text"
                placeholder={t('side_nav.client')}
                name='client'
                className='w-full border text-sm px-3 outline-none py-2'
                onChange={handleSearch}
                value={searchQuery.client}
            />

            <Input type="text"
                placeholder={t('side_nav.supplier')}
                name='supplier'
                className='w-full border text-sm px-3 outline-none py-2'
                onChange={handleSearch}
                value={searchQuery.supplier}
            />

            <Input
                placeholder={t('card.price')}
                name='price'
                type='number'
                className='w-full border text-sm px-3 outline-none py-2'
                onChange={handleSearch}
                value={searchQuery.price}
            />

            <Input
                placeholder={t('info.note')}
                name='note'
                type='text'
                className='w-full border text-sm px-3 outline-none py-2'
                onChange={handleSearch}
                value={searchQuery.note}
            />

            < Select onValueChange={operator => operator === 'all' ? setSearchQuery(prev => ({ ...prev, operator: '' })) : setSearchQuery(prev => ({ ...prev, operator }))}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('info.operator.select')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{t('info.operator.h1')}</SelectLabel>
                        <SelectItem value="all">{t("info.operator.all")}</SelectItem>
                        <SelectItem value="client">{t('side_nav.client')}</SelectItem>
                        <SelectItem value="supplier">{t('side_nav.supplier')}</SelectItem>
                        <SelectItem value="admin">{t('side_nav.admin')}</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            < Select onValueChange={status => status === 'all' ? setSearchQuery(prev => ({ ...prev, status: '' })) : setSearchQuery(prev => ({ ...prev, status }))}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('status.select')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{t('status.h1')}</SelectLabel>
                        <SelectItem value="all">{t("status.all")}</SelectItem>
                        <SelectItem value="pending">{t('status.pending')}</SelectItem>
                        <SelectItem value="confirmed">{t('status.confirmed')}</SelectItem>
                        <SelectItem value="completed">{t('status.completed')}</SelectItem>
                        <SelectItem value="canceled">{t('status.canceled')}</SelectItem>
                        <SelectItem value="cancel-request">{t('status.cancel-request')}</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

export default SearchBooking;
