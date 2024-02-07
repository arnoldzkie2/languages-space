import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';
import PermissionSwitch from './PermissionSwitch';

const FormCardsPermission: React.FC<{
  handleCheckboxChange: (isChecked: boolean, name: string) => void
  permissionData: AdminPermission;
}> = (props) => {
  const { permissionData, handleCheckboxChange } = props;
  const t = useTranslations('super-admin');

  return (
    <div className='flex flex-col gap-1 w-full'>
      <div className='font-bold text-lg text-foreground'>{t('client-card.h1')}</div>
      <PermissionSwitch
        label={t('admin.permissions.view_cards')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.view_cards}
        permissionKey='view_cards' />
      <PermissionSwitch
        label={t('admin.permissions.create_cards')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.create_cards}
        permissionKey='create_cards' />
      <PermissionSwitch
        label={t('admin.permissions.update_cards')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.update_cards}
        permissionKey='update_cards' />
      <PermissionSwitch
        label={t('admin.permissions.delete_cards')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.delete_cards}
        permissionKey='delete_cards' />
      <PermissionSwitch
        label={t('admin.permissions.bind_cards')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.bind_cards}
        permissionKey='bind_cards' />
      <PermissionSwitch
        label={t('admin.permissions.renew_cards')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.renew_cards}
        permissionKey='renew_cards' />

    </div>
  );
};

export default FormCardsPermission;
