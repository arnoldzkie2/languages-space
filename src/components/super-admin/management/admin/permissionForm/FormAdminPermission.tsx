import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';

const FormAdminPermission: React.FC<{
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
    permissionData: AdminPermission;
}> = (props) => {
    const { permissionData, handleChange } = props;
    const t = useTranslations('super-admin');

    return (
        <div className='flex flex-col gap-1 w-1/2'>
            <div className='font-bold text-lg'>{t('admin.h1')}</div>

            <div className='flex items-center w-full justify-between'>
                <label htmlFor="view_admin" className={`cursor-pointer ${permissionData.view_admin ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.view-admin')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.view_admin}
                    onChange={handleChange}
                    id='view_admin'
                    className='w-4 h-4'
                    name='view_admin'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="create_admin" className={`cursor-pointer ${permissionData.create_admin ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.create-admin')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.create_admin}
                    onChange={handleChange}
                    id='create_admin'
                    className='w-4 h-4'
                    name='create_admin'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="update_admin" className={`cursor-pointer ${permissionData.update_admin ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.update-admin')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.update_admin}
                    onChange={handleChange}
                    id='update_admin'
                    className='w-4 h-4'
                    name='update_admin'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="delete_admin" className={`cursor-pointer ${permissionData.delete_admin ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.delete-admin')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.delete_admin}
                    onChange={handleChange}
                    id='delete_admin'
                    className='w-4 h-4'
                    name='delete_admin'
                />
            </div>
        </div>
    );
};

export default FormAdminPermission;
