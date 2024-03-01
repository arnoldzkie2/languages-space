'use client'
import { useTranslations } from 'next-intl';
import React, { ChangeEvent } from 'react';
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SendPayslipButton from '../../SendPayslipButton';

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

const SearchSupplier: React.FC<Props> = ({ handleSearch, searchQuery }) => {

    const t = useTranslations()

    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)

    return (
        <div className='pt-4 mt-4 border-t'>
            <Label className='flex justify-between items-center mb-2 font-medium px-2'>
                {t('supplier.search')}
            </Label>
            <div>
                <div className='flex flex-col gap-3'>

                    <Input type="text"
                        placeholder={t('info.name')}
                        name='name'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.name}
                    />

                    <Input type="text"
                        placeholder={t('info.phone')}
                        name='phone_number'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.phone_number}
                    />

                    <Input type="text"
                        placeholder={t('info.organization')}
                        name='organization'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.organization}
                    />

                    <Input type="text"
                        placeholder={t('info.origin')}
                        name='origin'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.origin}
                    />

                    <Input type="text"
                        placeholder={t('info.note')}
                        name='note'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.note}
                    />

                    {isAdminAllowed('send_supplier_payslip') && <SendPayslipButton />}
                </div>
            </div>
        </div>
    );
};

export default SearchSupplier;
