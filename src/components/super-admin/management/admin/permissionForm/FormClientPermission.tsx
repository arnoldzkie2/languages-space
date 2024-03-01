import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';
import PermissionSwitch from './PermissionSwitch';

const FormClientPermission: React.FC<{
    permissionData: AdminPermission;
    handleCheckboxChange: (isChecked: boolean, name: string) => void

}> = (props) => {
    const { permissionData, handleCheckboxChange } = props;
    const t = useTranslations();

    return (
        <div className='flex flex-col gap-2 w-full'>
            <h1 className='font-bold text-lg text-foreground'>{t('client.manage')}</h1>

            <PermissionSwitch
                label={t('admin.permissions.list.view_client')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.view_client}
                permissionKey='view_client' />

            <PermissionSwitch
                label={t('admin.permissions.list.create_client')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.create_client}
                permissionKey='create_client' />
            <PermissionSwitch
                label={t('admin.permissions.list.update_client')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.update_client}
                permissionKey='update_client' />
            <PermissionSwitch
                label={t('admin.permissions.list.delete_client')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.delete_client}
                permissionKey='delete_client' />
            <PermissionSwitch
                label={t('admin.permissions.list.view_client_cards')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.view_client_cards}
                permissionKey='view_client_cards' />
            <PermissionSwitch
                label={t('admin.permissions.list.update_client_cards')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.update_client_cards}
                permissionKey='update_client_cards' />

            <PermissionSwitch
                label={t('admin.permissions.list.delete_client_cards')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.delete_client_cards}
                permissionKey='delete_client_cards' />


        </div>
    );
};

export default FormClientPermission;
