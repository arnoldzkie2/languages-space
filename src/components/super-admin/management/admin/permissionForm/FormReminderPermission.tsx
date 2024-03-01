import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';
import PermissionSwitch from './PermissionSwitch';

const FormRemindersPermission: React.FC<{
  handleCheckboxChange: (isChecked: boolean, name: string) => void
  permissionData: AdminPermission;
}> = (props) => {
  const { permissionData, handleCheckboxChange } = props;
  const t = useTranslations();

  return (
    <div className='flex flex-col gap-1 w-full'>
      <div className='font-bold text-lg text-foreground'>{t('booking.reminders.manage')}</div>


      <PermissionSwitch
        label={t('admin.permissions.list.view_reminders')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.view_reminders}
        permissionKey='view_reminders' />
      <PermissionSwitch
        label={t('admin.permissions.list.create_reminders')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.create_reminders}
        permissionKey='create_reminders' />
      <PermissionSwitch
        label={t('admin.permissions.list.update_reminders')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.update_reminders}
        permissionKey='update_reminders' />
      <PermissionSwitch
        label={t('admin.permissions.list.delete_reminders')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.delete_reminders}
        permissionKey='delete_reminders' />
      <PermissionSwitch
        label={t('admin.permissions.list.confirm_reminders')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.confirm_reminders}
        permissionKey='confirm_reminders' />
    </div>
  );
};

export default FormRemindersPermission;
