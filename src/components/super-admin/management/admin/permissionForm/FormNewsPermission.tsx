import React from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';
import PermissionSwitch from './PermissionSwitch';

const FormWebNewsPermission: React.FC<{
    handleCheckboxChange: (isChecked: boolean, name: string) => void
    permissionData: AdminPermission;
}> = (props) => {
    const { permissionData, handleCheckboxChange } = props;
    const t = useTranslations('super-admin');

    return (
        <div className='flex flex-col gap-1 w-full'>
            <div className='font-bold text-lg text-foreground'>{t('news.h1')}</div>

            <PermissionSwitch
                label={t('admin.permissions.view_news')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.view_news}
                permissionKey='view_news' />
            <PermissionSwitch
                label={t('admin.permissions.create_news')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.create_news}
                permissionKey='create_news' />
            <PermissionSwitch
                label={t('admin.permissions.update_news')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.update_news}
                permissionKey='update_news' />
            <PermissionSwitch
                label={t('admin.permissions.delete_news')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.delete_news}
                permissionKey='delete_news' />
        </div>
    );
};

export default FormWebNewsPermission;