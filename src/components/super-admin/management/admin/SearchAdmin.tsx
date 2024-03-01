import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    }

}

const SearchAdmin: React.FC<Props> = ({ handleSearch, searchQuery }) => {

    const t = useTranslations()

    return (
        <div className='pt-4 mt-4 border-t w-full'>
            <Label className='flex justify-between items-center mb-2 font-medium px-2'>
                {t('admin.search')}
            </Label>
            <div>
                <div className='flex flex-col gap-3'>

                    <Input type="text"
                        placeholder={t('info.name')}
                        name='name'
                        onChange={handleSearch}
                        value={searchQuery.name}
                    />

                    <Input type="text"
                        placeholder={t('info.phone')}
                        name='phone_number'
                        onChange={handleSearch}
                        value={searchQuery.phone_number}
                    />

                    <Input type="text"
                        placeholder={t('info.organization')}
                        name='organization'
                        onChange={handleSearch}
                        value={searchQuery.organization}
                    />

                    <Input type="text"
                        placeholder={t('info.origin')}
                        name='origin'
                        onChange={handleSearch}
                        value={searchQuery.origin}
                    />

                    <Input type="text"
                        placeholder={t('info.note')}
                        name='note'
                        onChange={handleSearch}
                        value={searchQuery.note}
                    />

                </div>
            </div>
        </div>
    );
};

export default SearchAdmin;
