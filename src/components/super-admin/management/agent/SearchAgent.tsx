import { useTranslations } from 'next-intl';
import React, { ChangeEvent } from 'react';
import SendPayslipButton from '../../SendPayslipButton';
import { Input } from '@/components/ui/input';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';

interface Props {

    handleSearch: (event: ChangeEvent<HTMLInputElement>) => void

    searchQuery: {
        username: string;
        phone_number: string;
        organization: string;
        origin: string;
        note: string;
    }

}

const SearchAgent: React.FC<Props> = ({ handleSearch, searchQuery }) => {

    const t = useTranslations()

    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)
    return (
        <div className='pt-4 mt-4 border-t w-full'>
            <div className='flex justify-between items-center mb-2 font-medium px-2'>
                {t('agent.search')}
            </div>
            <div>
                <div className='flex flex-col gap-3'>

                    <Input type="text"
                        placeholder={t('info.username')}
                        name='username'
                        onChange={handleSearch}
                        value={searchQuery.username}
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

                    {isAdminAllowed('send_agent_payslip') && <SendPayslipButton />}

                </div>
            </div>
        </div>
    );
};

export default SearchAgent;
