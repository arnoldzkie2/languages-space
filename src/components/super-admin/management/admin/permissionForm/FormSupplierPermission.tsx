'use client'
import { AdminPermission } from '@prisma/client';
import { useTranslations } from 'next-intl';
import React, { ChangeEvent } from 'react';
import PermissionSwitch from './PermissionSwitch';

const FormSupplierPermission = (props: {
    handleCheckboxChange: (isChecked: boolean, name: string) => void
    permissionData: AdminPermission
}) => {
    const { permissionData, handleCheckboxChange } = props;
    const t = useTranslations('super-admin'); // Assuming you have a translation function

    return (
        <div className='flex flex-col gap-1 w-full'>
            <div className='font-bold text-lg text-foreground'>{t('supplier.h1')}</div>

            <PermissionSwitch
                label={t('admin.permissions.view_supplier')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.view_supplier}
                permissionKey='view_supplier' />
            <PermissionSwitch
                label={t('admin.permissions.create_supplier')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.create_supplier}
                permissionKey='create_supplier' />
            <PermissionSwitch
                label={t('admin.permissions.update_supplier')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.update_supplier}
                permissionKey='update_supplier' />
            <PermissionSwitch
                label={t('admin.permissions.delete_supplier')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.delete_supplier}
                permissionKey='delete_supplier' />
            <PermissionSwitch
                label={t('admin.permissions.send_supplier_payslip')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.send_supplier_payslip}
                permissionKey='send_supplier_payslip' />
            <PermissionSwitch
                label={t('admin.permissions.view_supplier_earnings')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.view_supplier_earnings}
                permissionKey='view_supplier_earnings' />
            <PermissionSwitch
                label={t('admin.permissions.create_supplier_earnings')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.create_supplier_earnings}
                permissionKey='create_supplier_earnings' />
            <PermissionSwitch
                label={t('admin.permissions.delete_supplier_earnings')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.delete_supplier_earnings}
                permissionKey='delete_supplier_earnings' />
            <PermissionSwitch
                label={t('admin.permissions.view_supplier_deductions')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.view_supplier_deductions}
                permissionKey='view_supplier_deductions' />
            <PermissionSwitch
                label={t('admin.permissions.create_supplier_deductions')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.create_supplier_deductions}
                permissionKey='create_supplier_deductions' />
            <PermissionSwitch
                label={t('admin.permissions.delete_supplier_deductions')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.delete_supplier_deductions}
                permissionKey='delete_supplier_deductions' />
            <PermissionSwitch
                label={t('admin.permissions.view_supplier_payment_request')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.view_supplier_payment_request}
                permissionKey='view_supplier_payment_request' />
            <PermissionSwitch
                label={t('admin.permissions.update_supplier_payment_request')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.update_supplier_payment_request}
                permissionKey='update_supplier_payment_request' />

        </div>
    );
};

export default FormSupplierPermission;
