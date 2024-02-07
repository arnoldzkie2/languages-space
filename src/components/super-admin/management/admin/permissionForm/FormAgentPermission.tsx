import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';
import PermissionSwitch from './PermissionSwitch';

const FormAgentPermission: React.FC<{
  handleCheckboxChange: (isChecked: boolean, name: string) => void
  permissionData: AdminPermission;
}> = (props) => {
  const { permissionData, handleCheckboxChange } = props;
  const t = useTranslations('super-admin');

  return (
    <div className='flex flex-col gap-1 w-full'>
      <div className='font-bold text-lg text-foreground'>{t('agent.h1')}</div>

      <PermissionSwitch
        label={t('admin.permissions.view_agent')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.view_agent}
        permissionKey='view_agent' />
      <PermissionSwitch
        label={t('admin.permissions.create_agent')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.create_agent}
        permissionKey='create_agent' />
      <PermissionSwitch
        label={t('admin.permissions.update_agent')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.update_agent}
        permissionKey='update_agent' />
      <PermissionSwitch
        label={t('admin.permissions.delete_agent')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.delete_agent}
        permissionKey='delete_agent' />
      <PermissionSwitch
        label={t('admin.permissions.send_agent_payslip')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.send_agent_payslip}
        permissionKey='send_agent_payslip' />
      <PermissionSwitch
        label={t('admin.permissions.view_agent_earnings')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.view_agent_earnings}
        permissionKey='view_agent_earnings' />
      <PermissionSwitch
        label={t('admin.permissions.create_agent_earnings')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.create_agent_earnings}
        permissionKey='create_agent_earnings' />
      <PermissionSwitch
        label={t('admin.permissions.delete_agent_earnings')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.delete_agent_earnings}
        permissionKey='delete_agent_earnings' />
      <PermissionSwitch
        label={t('admin.permissions.view_agent_deductions')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.view_agent_deductions}
        permissionKey='view_agent_deductions' />
      <PermissionSwitch
        label={t('admin.permissions.create_agent_deductions')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.create_agent_deductions}
        permissionKey='create_agent_deductions' />
      <PermissionSwitch
        label={t('admin.permissions.delete_agent_deductions')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.delete_agent_deductions}
        permissionKey='delete_agent_deductions' />
      <PermissionSwitch
        label={t('admin.permissions.view_agent_payment_request')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.view_agent_payment_request}
        permissionKey='view_agent_payment_request' />
      <PermissionSwitch
        label={t('admin.permissions.update_agent_payment_request')}
        onCheckedChange={handleCheckboxChange}
        checked={permissionData.update_agent_payment_request}
        permissionKey='update_agent_payment_request' />

    </div>
  );
};

export default FormAgentPermission;
