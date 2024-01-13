import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';

const FormBookingPermission: React.FC<{
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
    permissionData: AdminPermission;
}> = (props) => {
    const { permissionData, handleChange } = props;
    const t = useTranslations('super-admin');

    return (
        <div className='flex flex-col gap-1 w-1/2'>
            <div className='font-bold text-lg'>{t('booking.h1')}</div>

            <div className='flex items-center w-full justify-between'>
                <label htmlFor="view_booking" className={`cursor-pointer ${permissionData.view_booking ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.view-booking')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.view_booking}
                    onChange={handleChange}
                    id='view_booking'
                    className='w-4 h-4'
                    name='view_booking'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="create_booking" className={`cursor-pointer ${permissionData.create_booking ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.create-booking')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.create_booking}
                    onChange={handleChange}
                    id='create_booking'
                    className='w-4 h-4'
                    name='create_booking'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="update_booking" className={`cursor-pointer ${permissionData.update_booking ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.update-booking')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.update_booking}
                    onChange={handleChange}
                    id='update_booking'
                    className='w-4 h-4'
                    name='update_booking'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="delete_booking" className={`cursor-pointer ${permissionData.delete_booking ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.delete-booking')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.delete_booking}
                    onChange={handleChange}
                    id='delete_booking'
                    className='w-4 h-4'
                    name='delete_booking'
                />
            </div>
        </div>
    );
};

export default FormBookingPermission;
