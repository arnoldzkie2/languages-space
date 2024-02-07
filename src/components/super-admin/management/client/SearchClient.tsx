'use'
import { useTranslations } from 'next-intl';
import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import useAdminClientStore from '@/lib/state/super-admin/clientStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {

    handleSearch: (event: ChangeEvent<HTMLInputElement>) => void

    searchQuery: {
        username: string;
        phone_number: string;
        organization: string;
        origin: string;
        note: string;
        cards: boolean
    }

    setSearchQuery: Dispatch<SetStateAction<{
        username: string;
        phone_number: string;
        organization: string;
        origin: string;
        note: string;
        cards: boolean;
    }>>

}

const SearchClient: React.FC<Props> = ({ handleSearch, searchQuery, setSearchQuery }) => {

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    const { clientWithCards, selectedClients } = useAdminClientStore()

    return (
        <div className='pt-4 mt-4 border-t w-full'>
            <div className='flex justify-between items-center mb-2 font-medium px-2'>
                {t('client.search')}
            </div>
            <div>
                <div className='flex flex-col gap-3'>

                    <Input type="text"
                        placeholder={tt('username')}
                        name='username'
                        onChange={handleSearch}
                        value={searchQuery.username}
                    />

                    <Input type="text"
                        placeholder={tt('phone')}
                        name='phone_number'
                        onChange={handleSearch}
                        value={searchQuery.phone_number}
                    />

                    <Input type="text"
                        placeholder={tt('organization')}
                        name='organization'
                        onChange={handleSearch}
                        value={searchQuery.organization}
                    />

                    <Input type="text"
                        placeholder={tt('origin')}
                        name='origin'
                        onChange={handleSearch}
                        value={searchQuery.origin}
                    />

                    <Input type="text"
                        placeholder={tt('note')}
                        name='note'
                        onChange={handleSearch}
                        value={searchQuery.note}
                    />

                    <div className='flex items-center gap-3 px-3'>
                        <Label htmlFor="cards" className='cursor-pointer'>{t('client.with-cards')}</Label>
                        <Checkbox checked={searchQuery.cards} onCheckedChange={() => setSearchQuery(prev => ({ ...prev, cards: !prev.cards }))} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchClient;
