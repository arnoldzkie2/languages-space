import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';

const FormCoursesPermission: React.FC<{
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
    permissionData: AdminPermission;
}> = (props) => {
    const { permissionData, handleChange } = props;
    const t = useTranslations('super-admin');

    return (
        <div className='flex flex-col gap-1 w-1/2'>
            <div className='font-bold text-lg'>{t('courses.h1')}</div>

            <div className='flex items-center w-full justify-between'>
                <label htmlFor="view_courses" className={`cursor-pointer ${permissionData.view_courses ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.view-courses')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.view_courses}
                    onChange={handleChange}
                    id='view_courses'
                    className='w-4 h-4'
                    name='view_courses'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="create_courses" className={`cursor-pointer ${permissionData.create_courses ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.create-courses')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.create_courses}
                    onChange={handleChange}
                    id='create_courses'
                    className='w-4 h-4'
                    name='create_courses'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="update_courses" className={`cursor-pointer ${permissionData.update_courses ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.update-courses')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.update_courses}
                    onChange={handleChange}
                    id='update_courses'
                    className='w-4 h-4'
                    name='update_courses'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="delete_courses" className={`cursor-pointer ${permissionData.delete_courses ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.delete-courses')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.delete_courses}
                    onChange={handleChange}
                    id='delete_courses'
                    className='w-4 h-4'
                    name='delete_courses'
                />
            </div>
        </div>
    );
};

export default FormCoursesPermission;
