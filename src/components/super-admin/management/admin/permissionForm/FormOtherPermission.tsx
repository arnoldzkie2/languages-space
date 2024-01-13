import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';

const FormOtherPermission: React.FC<{
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  permissionData: AdminPermission;
}> = (props) => {
  const { permissionData, handleChange } = props;
  const t = useTranslations('super-admin');
  const tt = useTranslations('global')

  return (
    <div className='flex flex-col gap-1 w-1/2'>
      <div className='font-bold text-lg'>{tt('other')}</div>

      <div className='flex items-center w-full justify-between'>
        <label htmlFor="download_table" className={`cursor-pointer ${permissionData.download_table ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.download-table')}</label>
        <input
          type="checkbox"
          checked={permissionData.download_table}
          onChange={handleChange}
          id='download_table'
          className='w-4 h-4'
          name='download_table'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="handle_settings" className={`cursor-pointer ${permissionData.handle_settings ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.handle-settings')}</label>
        <input
          type="checkbox"
          checked={permissionData.handle_settings}
          onChange={handleChange}
          id='handle_settings'
          className='w-4 h-4'
          name='handle_settings'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="view_statistics" className={`cursor-pointer ${permissionData.view_statistics ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.view-statistics')}</label>
        <input
          type="checkbox"
          checked={permissionData.view_statistics}
          onChange={handleChange}
          id='view_statistics'
          className='w-4 h-4'
          name='view_statistics'
        />
      </div>
    </div>
  );
};

export default FormOtherPermission;
