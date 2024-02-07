import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';
import PermissionSwitch from './PermissionSwitch';

const FormOtherPermission: React.FC<{
  handleCheckboxChange: (isChecked: boolean, name: string) => void
  permissionData: AdminPermission;
}> = (props) => {
  const { permissionData, handleCheckboxChange } = props;
  const t = useTranslations('super-admin');
  const tt = useTranslations('global')

  return (
    <div className='flex flex-col gap-1 w-full'>
      <div className='font-bold text-lg text-foreground'>{tt('other')}</div>

      <PermissionSwitch
        label={t('admin.permissions.download_table')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.download_table}
        permissionKey='download_table' />
      <PermissionSwitch
        label={t('admin.permissions.handle_settings')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.handle_settings}
        permissionKey='handle_settings' />
      <PermissionSwitch
        label={t('admin.permissions.view_statistics')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.view_statistics}
        permissionKey='view_statistics' />
      <PermissionSwitch
        label={t('admin.permissions.receive_cancel_request_email')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.receive_cancel_request_email}
        permissionKey='receive_cancel_request_email' />
    </div>
  );
};

export default FormOtherPermission;
