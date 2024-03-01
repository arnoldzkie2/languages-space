import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';
import PermissionSwitch from './PermissionSwitch';

const FormSupplierSchedulePermission: React.FC<{
  handleCheckboxChange: (isChecked: boolean, name: string) => void
  permissionData: AdminPermission;
}> = (props) => {
  const { permissionData, handleCheckboxChange } = props;
  const t = useTranslations();

  return (
    <div className='flex flex-col gap-1 w-full'>
      <div className='font-bold text-lg text-foreground'>{t('schedule.manage')}</div>

      <PermissionSwitch
        label={t('admin.permissions.list.view_supplier_schedule')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.view_supplier_schedule}
        permissionKey='view_supplier_schedule' />
      <PermissionSwitch
        label={t('admin.permissions.list.create_supplier_schedule')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.create_supplier_schedule}
        permissionKey='create_supplier_schedule' />
      <PermissionSwitch
        label={t('admin.permissions.list.delete_supplier_schedule')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.delete_supplier_schedule}
        permissionKey='delete_supplier_schedule' />

    </div>
  );
};

export default FormSupplierSchedulePermission;
