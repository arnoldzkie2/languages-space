import { useTranslations } from 'next-intl';
import React, { ChangeEvent } from 'react';

interface Props {

    handleSearch: (event: ChangeEvent<HTMLInputElement>) => void

    searchQuery: {
        name: string;
        phone_number: string;
        organization: string;
        origin: string;
        note: string;
        cards: boolean
    }

}

const SearchClient: React.FC<Props> = ({ handleSearch, searchQuery }) => {

    const t = useTranslations('super-admin')

    return (
        <div className='pt-4 mt-4 border-t border-gray-300 w-full'>
            <div className='flex justify-between items-center mb-2 font-medium px-2'>
                {t('client.search')}
            </div>
            <div>
                <div className='flex flex-col text-gray-700 gap-3'>

                    <input type="text"
                        placeholder={t('client.name')}
                        name='name'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.name}
                    />

                    <input type="text"
                        placeholder={t('client.phone')}
                        name='phone_number'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.phone_number}
                    />

                    <input type="text"
                        placeholder={t('client.organization')}
                        name='organization'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.organization}
                    />

                    <input type="text"
                        placeholder={t('client.origin')}
                        name='origin'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.origin}
                    />

                    <input type="text"
                        placeholder={t('client.note')}
                        name='note'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.note}
                    />

                    <div className='flex items-center gap-3 px-3'>
                        <label htmlFor="cards" className='cursor-pointer'>{t('client.with-cards')}</label>
                        <input id='cards' type="checkbox" name='cards' onChange={handleSearch} checked={searchQuery.cards} />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SearchClient;
