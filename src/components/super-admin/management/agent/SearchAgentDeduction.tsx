import { useTranslations } from 'next-intl';
import React, { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';

interface Props {

    handleSearch: (event: ChangeEvent<HTMLInputElement>) => void

    searchQuery: {
        name: string;
        amount: string;
        rate: string;
        quantity: string;
    }

}

const SearchAgentDeduction: React.FC<Props> = ({ handleSearch, searchQuery }) => {

    const t = useTranslations()

    return (
        <div className='w-full'>
            <div className='flex justify-between items-center mb-2 font-medium px-2'>
                {t('operation.search')}
            </div>
            <div>
                <div className='flex flex-col gap-3'>

                    <Input type="text"
                        placeholder={t('info.name')}
                        name='name'
                        onChange={handleSearch}
                        value={searchQuery.name}
                    />

                    <Input type="text"
                        placeholder={t('balance.amount')}
                        name='amount'
                        onChange={handleSearch}
                        value={searchQuery.amount}
                    />

                    <Input type="text"
                        placeholder={t('info.rate')}
                        name='rate'
                        onChange={handleSearch}
                        value={searchQuery.rate}
                    />

                    <Input type="text"
                        placeholder={t('info.quantity')}
                        name='quantity'
                        onChange={handleSearch}
                        value={searchQuery.quantity}
                    />

                </div>
            </div>
        </div>
    );
};

export default SearchAgentDeduction;
