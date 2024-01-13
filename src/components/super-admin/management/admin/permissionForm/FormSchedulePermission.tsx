import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';

const FormSupplierSchedulePermission: React.FC<{
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  permissionData: AdminPermission;
}> = (props) => {
  const { permissionData, handleChange } = props;
  const t = useTranslations('super-admin');

  return (
    <div className='flex flex-col gap-1 w-1/2'>
      <div className='font-bold text-lg'>{t('schedule.h1')}</div>

      <div className='flex items-center w-full justify-between'>
        <label htmlFor="view_supplier_schedule" className={`cursor-pointer ${permissionData.view_supplier_schedule ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.view-supplier-schedule')}</label>
        <input
          type="checkbox"
          checked={permissionData.view_supplier_schedule}
          onChange={handleChange}
          id='view_supplier_schedule'
          className='w-4 h-4'
          name='view_supplier_schedule'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="create_supplier_schedule" className={`cursor-pointer ${permissionData.create_supplier_schedule ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.create-supplier-schedule')}</label>
        <input
          type="checkbox"
          checked={permissionData.create_supplier_schedule}
          onChange={handleChange}
          id='create_supplier_schedule'
          className='w-4 h-4'
          name='create_supplier_schedule'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="delete_supplier_schedule" className={`cursor-pointer ${permissionData.delete_supplier_schedule ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.delete-supplier-schedule')}</label>
        <input
          type="checkbox"
          checked={permissionData.delete_supplier_schedule}
          onChange={handleChange}
          id='delete_supplier_schedule'
          className='w-4 h-4'
          name='delete_supplier_schedule'
        />
      </div>
    </div>
  );
};

export default FormSupplierSchedulePermission;
