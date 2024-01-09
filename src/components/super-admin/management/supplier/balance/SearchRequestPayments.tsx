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
        <div className='pt-4 mt-4 border-t border-gray-300'>
            <div className='flex justify-between items-center mb-2 font-medium px-2'>
                {t('supplier.payment.search')}
            </div>
            <div>
                <div className='flex flex-col text-gray-700 gap-3'>

                    <input type="text"
                        placeholder={tt('amount')}
                        name='amount'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.amount}
                    />

                    <input type="text"
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
                            className='px-2 py-1.5 rounded-md outline-none'
                        >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SearchRequestPayments