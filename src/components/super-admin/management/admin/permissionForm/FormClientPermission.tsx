import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';

const FormClientPermission: React.FC<{
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
    permissionData: AdminPermission;
}> = (props) => {
    const { permissionData, handleChange } = props;
    const t = useTranslations('super-admin');

    return (
        <div className='flex flex-col gap-1 w-1/2'>
            <div className='font-bold text-lg'>{t('client.h1')}</div>

            <div className='flex items-center w-full justify-between'>
                <label htmlFor="view_client" className={`cursor-pointer ${permissionData.view_client ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.view-client')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.view_client}
                    onChange={handleChange}
                    id='view_client'
                    className='w-4 h-4'
                    name='view_client'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="create_client" className={`cursor-pointer ${permissionData.create_client ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.create-client')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.create_client}
                    onChange={handleChange}
                    id='create_client'
                    className='w-4 h-4'
                    name='create_client'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="update_client" className={`cursor-pointer ${permissionData.update_client ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.update-client')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.update_client}
                    onChange={handleChange}
                    id='update_client'
                    className='w-4 h-4'
                    name='update_client'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="delete_client" className={`cursor-pointer ${permissionData.delete_client ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.delete-client')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.delete_client}
                    onChange={handleChange}
                    id='delete_client'
                    className='w-4 h-4'
                    name='delete_client'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="view_client_cards" className={`cursor-pointer ${permissionData.view_client_cards ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.view-client-cards')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.view_client_cards}
                    onChange={handleChange}
                    id='view_client_cards'
                    className='w-4 h-4'
                    name='view_client_cards'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="update_client_cards" className={`cursor-pointer ${permissionData.update_client_cards ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.update-client-cards')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.update_client_cards}
                    onChange={handleChange}
                    id='update_client_cards'
                    className='w-4 h-4'
                    name='update_client_cards'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="delete_client_cards" className={`cursor-pointer ${permissionData.delete_client_cards ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.delete-client-cards')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.delete_client_cards}
                    onChange={handleChange}
                    id='delete_client_cards'
                    className='w-4 h-4'
                    name='delete_client_cards'
                />
            </div>
        </div>
    );
};

export default FormClientPermission;
