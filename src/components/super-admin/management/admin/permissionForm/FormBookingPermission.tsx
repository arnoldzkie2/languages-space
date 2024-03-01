import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';
import PermissionSwitch from './PermissionSwitch';

const FormBookingPermission: React.FC<{
    handleCheckboxChange: (isChecked: boolean, name: string) => void
    permissionData: AdminPermission;
}> = (props) => {
    const { permissionData, handleCheckboxChange } = props;
    const t = useTranslations();

    return (
        <div className='flex flex-col gap-1 w-full'>
            <div className='font-bold text-lg text-foreground'>{t('booking.manage')}</div>

            <PermissionSwitch
                label={t('admin.permissions.list.view_booking')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.view_booking}
                permissionKey='view_booking' />
              
            <PermissionSwitch
                label={t('admin.permissions.list.create_booking')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.create_booking}
                permissionKey='create_booking' />

            <PermissionSwitch
                label={t('admin.permissions.list.update_booking')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.update_booking}
                permissionKey='update_booking' />

            <PermissionSwitch
                label={t('admin.permissions.list.delete_booking')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.delete_booking}
                permissionKey='delete_booking' />
            <PermissionSwitch
                label={t('admin.permissions.list.cancel_booking')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.cancel_booking}
                permissionKey='cancel_booking' />
            <PermissionSwitch
                label={t('admin.permissions.list.view_booking_request')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.view_booking_request}
                permissionKey='view_booking_request' />
            <PermissionSwitch
                label={t('admin.permissions.list.create_booking_request')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.create_booking_request}
                permissionKey='create_booking_request' />
            <PermissionSwitch
                label={t('admin.permissions.list.cancel_booking_request')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.cancel_booking_request}
                permissionKey='cancel_booking_request' />
            <PermissionSwitch
                label={t('admin.permissions.list.delete_booking_request')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.delete_booking_request}
                permissionKey='delete_booking_request' />

        </div>
    );
};

export default FormBookingPermission;
