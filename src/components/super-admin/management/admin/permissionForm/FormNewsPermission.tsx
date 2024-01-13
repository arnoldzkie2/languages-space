import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';

const FormWebNewsPermission: React.FC<{
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
    permissionData: AdminPermission;
}> = (props) => {
    const { permissionData, handleChange } = props;
    const t = useTranslations('super-admin');

    return (
        <div className='flex flex-col gap-1 w-1/2'>
            <div className='font-bold text-lg'>{t('news.h1')}</div>

            <div className='flex items-center w-full justify-between'>
                <label htmlFor="view_news" className={`cursor-pointer ${permissionData.view_news ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.view-news')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.view_news}
                    onChange={handleChange}
                    id='view_news'
                    className='w-4 h-4'
                    name='view_news'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="create_news" className={`cursor-pointer ${permissionData.create_news ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.create-news')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.create_news}
                    onChange={handleChange}
                    id='create_news'
                    className='w-4 h-4'
                    name='create_news'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="update_news" className={`cursor-pointer ${permissionData.update_news ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.update-news')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.update_news}
                    onChange={handleChange}
                    id='update_news'
                    className='w-4 h-4'
                    name='update_news'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="delete_news" className={`cursor-pointer ${permissionData.delete_news ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.delete-news')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.delete_news}
                    onChange={handleChange}
                    id='delete_news'
                    className='w-4 h-4'
                    name='delete_news'
                />
            </div>
        </div>
    );
};

export default FormWebNewsPermission;
