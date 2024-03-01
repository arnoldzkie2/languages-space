import React from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';
import PermissionSwitch from './PermissionSwitch';

const FormOrdersPermission: React.FC<{
  handleCheckboxChange: (isChecked: boolean, name: string) => void
  permissionData: AdminPermission;
}> = (props) => {
  const { permissionData, handleCheckboxChange } = props;
  const t = useTranslations();

  return (
    <div className='flex flex-col gap-1 w-full'>
      <div className='font-bold text-lg text-foreground'>{t('order.manage')}</div>

      <PermissionSwitch
        label={t('admin.permissions.list.view_orders')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.view_orders}
        permissionKey='view_orders' />
      <PermissionSwitch
        label={t('admin.permissions.list.create_orders')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.create_orders}
        permissionKey='create_orders' />
      <PermissionSwitch
        label={t('admin.permissions.list.update_orders')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.update_orders}
        permissionKey='update_orders' />
      <PermissionSwitch
        label={t('admin.permissions.list.delete_orders')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.delete_orders}
        permissionKey='delete_orders' />
    </div>
  );
};

export default FormOrdersPermission;
