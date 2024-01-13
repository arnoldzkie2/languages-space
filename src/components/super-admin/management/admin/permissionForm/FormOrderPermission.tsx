import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';

const FormOrdersPermission: React.FC<{
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  permissionData: AdminPermission;
}> = (props) => {
  const { permissionData, handleChange } = props;
  const t = useTranslations('super-admin');

  return (
    <div className='flex flex-col gap-1 w-1/2'>
      <div className='font-bold text-lg'>{t('order.h1')}</div>

      <div className='flex items-center w-full justify-between'>
        <label htmlFor="view_orders" className={`cursor-pointer ${permissionData.view_orders ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.view-orders')}</label>
        <input
          type="checkbox"
          checked={permissionData.view_orders}
          onChange={handleChange}
          id='view_orders'
          className='w-4 h-4'
          name='view_orders'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="create_orders" className={`cursor-pointer ${permissionData.create_orders ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.create-orders')}</label>
        <input
          type="checkbox"
          checked={permissionData.create_orders}
          onChange={handleChange}
          id='create_orders'
          className='w-4 h-4'
          name='create_orders'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="update_orders" className={`cursor-pointer ${permissionData.update_orders ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.update-orders')}</label>
        <input
          type="checkbox"
          checked={permissionData.update_orders}
          onChange={handleChange}
          id='update_orders'
          className='w-4 h-4'
          name='update_orders'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="delete_orders" className={`cursor-pointer ${permissionData.delete_orders ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.delete-orders')}</label>
        <input
          type="checkbox"
          checked={permissionData.delete_orders}
          onChange={handleChange}
          id='delete_orders'
          className='w-4 h-4'
          name='delete_orders'
        />
      </div>
    </div>
  );
};

export default FormOrdersPermission;
