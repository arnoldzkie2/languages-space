import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';

const FormCardsPermission: React.FC<{
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  permissionData: AdminPermission;
}> = (props) => {
  const { permissionData, handleChange } = props;
  const t = useTranslations('super-admin');

  return (
    <div className='flex flex-col gap-1 w-1/2'>
      <div className='font-bold text-lg'>{t('client-card.h1')}</div>

      <div className='flex items-center w-full justify-between'>
        <label htmlFor="view_cards" className={`cursor-pointer ${permissionData.view_cards ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.view-cards')}</label>
        <input
          type="checkbox"
          checked={permissionData.view_cards}
          onChange={handleChange}
          id='view_cards'
          className='w-4 h-4'
          name='view_cards'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="create_cards" className={`cursor-pointer ${permissionData.create_cards ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.create-cards')}</label>
        <input
          type="checkbox"
          checked={permissionData.create_cards}
          onChange={handleChange}
          id='create_cards'
          className='w-4 h-4'
          name='create_cards'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="update_cards" className={`cursor-pointer ${permissionData.update_cards ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.update-cards')}</label>
        <input
          type="checkbox"
          checked={permissionData.update_cards}
          onChange={handleChange}
          id='update_cards'
          className='w-4 h-4'
          name='update_cards'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="delete_cards" className={`cursor-pointer ${permissionData.delete_cards ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.delete-cards')}</label>
        <input
          type="checkbox"
          checked={permissionData.delete_cards}
          onChange={handleChange}
          id='delete_cards'
          className='w-4 h-4'
          name='delete_cards'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="bind_cards" className={`cursor-pointer ${permissionData.bind_cards ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.bind-cards')}</label>
        <input
          type="checkbox"
          checked={permissionData.bind_cards}
          onChange={handleChange}
          id='bind_cards'
          className='w-4 h-4'
          name='bind_cards'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="renew_cards" className={`cursor-pointer ${permissionData.renew_cards ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.renew-cards')}</label>
        <input
          type="checkbox"
          checked={permissionData.renew_cards}
          onChange={handleChange}
          id='renew_cards'
          className='w-4 h-4'
          name='renew_cards'
        />
      </div>
    </div>
  );
};

export default FormCardsPermission;
