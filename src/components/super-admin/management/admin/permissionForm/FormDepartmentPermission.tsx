import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';

const FormDepartmentPermission: React.FC<{
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  permissionData: AdminPermission;
}> = (props) => {
  const { permissionData, handleChange } = props;
  const t = useTranslations('super-admin');

  return (
    <div className='flex flex-col gap-1 w-1/2'>
      <div className='font-bold text-lg'>{t('department.h1')}</div>

      <div className='flex items-center w-full justify-between'>
        <label htmlFor="view_department" className={`cursor-pointer ${permissionData.view_department ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.view-department')}</label>
        <input
          type="checkbox"
          checked={permissionData.view_department}
          onChange={handleChange}
          id='view_department'
          className='w-4 h-4'
          name='view_department'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="create_department" className={`cursor-pointer ${permissionData.create_department ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.create-department')}</label>
        <input
          type="checkbox"
          checked={permissionData.create_department}
          onChange={handleChange}
          id='create_department'
          className='w-4 h-4'
          name='create_department'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="update_department" className={`cursor-pointer ${permissionData.update_department ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.update-department')}</label>
        <input
          type="checkbox"
          checked={permissionData.update_department}
          onChange={handleChange}
          id='update_department'
          className='w-4 h-4'
          name='update_department'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="delete_department" className={`cursor-pointer ${permissionData.delete_department ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.delete-department')}</label>
        <input
          type="checkbox"
          checked={permissionData.delete_department}
          onChange={handleChange}
          id='delete_department'
          className='w-4 h-4'
          name='delete_department'
        />
      </div>
    </div>
  );
};

export default FormDepartmentPermission;
