import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';
import PermissionSwitch from './PermissionSwitch';

const FormBookingCommentsPermission: React.FC<{
    handleCheckboxChange: (isChecked: boolean, name: string) => void
    permissionData: AdminPermission;
}> = (props) => {
    const { permissionData, handleCheckboxChange } = props;
    const t = useTranslations('');

    return (
        <div className='flex flex-col gap-1 w-full'>
            <div className='font-bold text-lg text-foreground'>{t('booking.comments.manage')}</div>

            <PermissionSwitch
                label={t('admin.permissions.list.view_booking_comments')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.view_booking_comments}
                permissionKey='view_booking_comments' />

            <PermissionSwitch
                label={t('admin.permissions.list.delete_booking_comments')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.delete_booking_comments}
                permissionKey='delete_booking_comments' />

            <PermissionSwitch
                label={t('admin.permissions.list.view_booking_comments_template')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.view_booking_comments_template}
                permissionKey='view_booking_comments_template' />

            <PermissionSwitch
                label={t('admin.permissions.list.create_booking_comments_template')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.create_booking_comments_template}
                permissionKey='create_booking_comments_template' />
            <PermissionSwitch
                label={t('admin.permissions.list.update_booking_comments_template')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.update_booking_comments_template}
                permissionKey='update_booking_comments_template' />

            <PermissionSwitch
                label={t('admin.permissions.list.delete_booking_comments_template')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.delete_booking_comments_template}
                permissionKey='delete_booking_comments_template' />
        </div>
    );
};

export default FormBookingCommentsPermission;
