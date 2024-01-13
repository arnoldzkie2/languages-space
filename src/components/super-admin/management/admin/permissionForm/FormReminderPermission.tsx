import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';

const FormRemindersPermission: React.FC<{
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  permissionData: AdminPermission;
}> = (props) => {
  const { permissionData, handleChange } = props;
  const t = useTranslations('super-admin');

  return (
    <div className='flex flex-col gap-1 w-1/2'>
      <div className='font-bold text-lg'>{t('booking.reminders.h1')}</div>

      <div className='flex items-center w-full justify-between'>
        <label htmlFor="view_reminders" className={`cursor-pointer ${permissionData.view_reminders ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.view-reminders')}</label>
        <input
          type="checkbox"
          checked={permissionData.view_reminders}
          onChange={handleChange}
          id='view_reminders'
          className='w-4 h-4'
          name='view_reminders'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="create_reminders" className={`cursor-pointer ${permissionData.create_reminders ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.create-reminders')}</label>
        <input
          type="checkbox"
          checked={permissionData.create_reminders}
          onChange={handleChange}
          id='create_reminders'
          className='w-4 h-4'
          name='create_reminders'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="update_reminders" className={`cursor-pointer ${permissionData.update_reminders ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.update-reminders')}</label>
        <input
          type="checkbox"
          checked={permissionData.update_reminders}
          onChange={handleChange}
          id='update_reminders'
          className='w-4 h-4'
          name='update_reminders'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="delete_reminders" className={`cursor-pointer ${permissionData.delete_reminders ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.delete-reminders')}</label>
        <input
          type="checkbox"
          checked={permissionData.delete_reminders}
          onChange={handleChange}
          id='delete_reminders'
          className='w-4 h-4'
          name='delete_reminders'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="confirm_reminders" className={`cursor-pointer ${permissionData.confirm_reminders ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.confirm-reminders')}</label>
        <input
          type="checkbox"
          checked={permissionData.confirm_reminders}
          onChange={handleChange}
          id='confirm_reminders'
          className='w-4 h-4'
          name='confirm_reminders'
        />
      </div>
    </div>
  );
};

export default FormRemindersPermission;
