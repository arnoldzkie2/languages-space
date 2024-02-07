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

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <div className='flex w-full gap-3'>

            <Input type="text"
                placeholder={tt('name')}
                name='name'
                className='w-full border text-sm px-3 outline-none py-2'
                onChange={handleSearch}
                value={searchQuery.name}
            />

            <Input type="text"
                placeholder={tt('client')}
                name='client'
                className='w-full border text-sm px-3 outline-none py-2'
                onChange={handleSearch}
                value={searchQuery.client}
            />

            <Input type="text"
                placeholder={tt('supplier')}
                name='supplier'
                className='w-full border text-sm px-3 outline-none py-2'
                onChange={handleSearch}
                value={searchQuery.supplier}
            />

            <Input
                placeholder={tt('price')}
                name='price'
                type='number'
                className='w-full border text-sm px-3 outline-none py-2'
                onChange={handleSearch}
                value={searchQuery.price}
            />

            <Input
                placeholder={tt('note')}
                name='note'
                type='text'
                className='w-full border text-sm px-3 outline-none py-2'
                onChange={handleSearch}
                value={searchQuery.note}
            />

            < Select onValueChange={operator => operator === 'all' ? setSearchQuery(prev => ({ ...prev, operator: '' })) : setSearchQuery(prev => ({ ...prev, operator }))}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={tt('select-operator')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{tt('operator')}</SelectLabel>
                        <SelectItem value="all">{tt("all-operator")}</SelectItem>
                        <SelectItem value="client">{tt('client')}</SelectItem>
                        <SelectItem value="supplier">{tt('supplier')}</SelectItem>
                        <SelectItem value="admin">{tt('admin')}</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            < Select onValueChange={status => status === 'all' ? setSearchQuery(prev => ({ ...prev, status: '' })) : setSearchQuery(prev => ({ ...prev, status }))}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={tt('select-status')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{tt('status')}</SelectLabel>
                        <SelectItem value="all">{tt("all-status")}</SelectItem>
                        <SelectItem value="pending">{tt('pending')}</SelectItem>
                        <SelectItem value="confirmed">{tt('confirmed')}</SelectItem>
                        <SelectItem value="completed">{tt('completed')}</SelectItem>
                        <SelectItem value="canceled">{tt('canceled')}</SelectItem>
                        <SelectItem value="cancel-request">{tt('cancel-request')}</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

export default SearchBooking;
