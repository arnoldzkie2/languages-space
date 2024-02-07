import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import React, { ChangeEvent, ChangeEventHandler } from 'react'


interface Props {

    handleSearch: (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => void;
    searchQuery: {
        amount: string;
        payment_address: string;
        status: string
    }
}

const SearchRequestPayments = ({ handleSearch, searchQuery }: Props) => {
    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <div className='pt-4 mt-4 border-t'>
            <div className='flex justify-between items-center mb-2 font-medium px-2'>
                {t('supplier.payment.search')}
            </div>
            <div>
                <div className='flex flex-col gap-3'>

                    <Input type="text"
                        placeholder={tt('amount')}
                        name='amount'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.amount}
                    />

                    <Input type="text"
                        placeholder={tt('payment')}
                        name='payment_address'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.payment_address}
                    />

                    <div className='flex flex-col gap-1'>
                        <label htmlFor="status">{tt('status')}</label>
                        <select
                            name="status" id="status"
                            value={searchQuery.status}
                            onChange={handleSearch}
                            className='px-2 py-2 rounded-md outline-none bg-card border'
                        >
                            <option value="">{tt("all-status")}</option>
                            <option value="pending">{tt("pending")}</option>
                            <option value="completed">{tt('completed')}</option>
                        </select>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SearchRequestPayments