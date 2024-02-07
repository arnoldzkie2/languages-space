'use client'

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
    searchQuery: string
}

const SearchCourse: React.FC<Props> = ({ setSearchQuery, searchQuery }) => {

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')
    return (
        <div className='pt-4'>
            <Label className='flex justify-between items-center mb-2 font-medium px-2'>
                {t('courses.search')}
            </Label>
            <div>
                <div className='flex flex-col gap-3'>

                    <Input type="text"
                        placeholder={tt('name')}
                        name='name'
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchCourse;
