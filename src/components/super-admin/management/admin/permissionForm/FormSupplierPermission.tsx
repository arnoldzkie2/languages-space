'use client'
import { AdminPermission } from '@prisma/client';
import { useTranslations } from 'next-intl';
import React, { ChangeEvent } from 'react';

const FormSupplierPermission = (props: {
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void
    permissionData: AdminPermission
}) => {
    const { permissionData, handleChange } = props;
    const t = useTranslations('super-admin'); // Assuming you have a translation function

    return (
        <div className='flex flex-col gap-1 w-1/2'>
            <div className='font-bold text-lg'>{t('supplier.h1')}</div>

            <div className='flex items-center w-full justify-between'>
                <label htmlFor="view_supplier" className={`${permissionData.view_supplier ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500 cursor-pointer`}>- {t('admin.permissions.view-supplier')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.view_supplier}
                    onChange={handleChange}
                    id='view_supplier'
                    className='w-4 h-4'
                    name='view_supplier'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="create_supplier" className={`${permissionData.create_supplier ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500 cursor-pointer`}>- {t('admin.permissions.create-supplier')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.create_supplier}
                    onChange={handleChange}
                    id='create_supplier'
                    className='w-4 h-4'
                    name='create_supplier'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="update_supplier" className={`${permissionData.update_supplier ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500 cursor-pointer`}>- {t('admin.permissions.update-supplier')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.update_supplier}
                    onChange={handleChange}
                    id='update_supplier'
                    className='w-4 h-4'
                    name='update_supplier'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="delete_supplier" className={`${permissionData.delete_supplier ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500 cursor-pointer`}>- {t('admin.permissions.delete-supplier')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.delete_supplier}
                    onChange={handleChange}
                    id='delete_supplier'
                    className='w-4 h-4'
                    name='delete_supplier'
                />
            </div>
            <div className='flex items-center w-full justify-between'>
                <label htmlFor="send_supplier_payslip" className={`${permissionData.send_supplier_payslip ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500 cursor-pointer`}>- {t('admin.permissions.send-supplier-payslip')}</label>
                <input
                    type="checkbox"
                    checked={permissionData.send_supplier_payslip}
                    onChange={handleChange}
                    id='send_supplier_payslip'
                    className='w-4 h-4'
                    name='send_supplier_payslip'
                />
            </div>
        </div>
    );
};

export default FormSupplierPermission;
