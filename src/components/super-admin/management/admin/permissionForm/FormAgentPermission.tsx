import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';

const FormAgentPermission: React.FC<{
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  permissionData: AdminPermission;
}> = (props) => {
  const { permissionData, handleChange } = props;
  const t = useTranslations('super-admin');

  return (
    <div className='flex flex-col gap-1 w-1/2'>
      <div className='font-bold text-lg'>{t('agent.h1')}</div>

      <div className='flex items-center w-full justify-between'>
        <label htmlFor="view_agent" className={`cursor-pointer ${permissionData.view_agent ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.view-agent')}</label>
        <input
          type="checkbox"
          checked={permissionData.view_agent}
          onChange={handleChange}
          id='view_agent'
          className='w-4 h-4'
          name='view_agent'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="create_agent" className={`cursor-pointer ${permissionData.create_agent ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.create-agent')}</label>
        <input
          type="checkbox"
          checked={permissionData.create_agent}
          onChange={handleChange}
          id='create_agent'
          className='w-4 h-4'
          name='create_agent'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="update_agent" className={`cursor-pointer ${permissionData.update_agent ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.update-agent')}</label>
        <input
          type="checkbox"
          checked={permissionData.update_agent}
          onChange={handleChange}
          id='update_agent'
          className='w-4 h-4'
          name='update_agent'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="delete_agent" className={`cursor-pointer ${permissionData.delete_agent ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.delete-agent')}</label>
        <input
          type="checkbox"
          checked={permissionData.delete_agent}
          onChange={handleChange}
          id='delete_agent'
          className='w-4 h-4'
          name='delete_agent'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="send_agent_payslip" className={`cursor-pointer ${permissionData.send_agent_payslip ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.send-agent-payslip')}</label>
        <input
          type="checkbox"
          checked={permissionData.send_agent_payslip}
          onChange={handleChange}
          id='send_agent_payslip'
          className='w-4 h-4'
          name='send_agent_payslip'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="create_agent_earnings" className={`cursor-pointer ${permissionData.create_agent_earnings ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.create-agent-earnings')}</label>
        <input
          type="checkbox"
          checked={permissionData.create_agent_earnings}
          onChange={handleChange}
          id='create_agent_earnings'
          className='w-4 h-4'
          name='create_agent_earnings'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="create_agent_deductions" className={`cursor-pointer ${permissionData.create_agent_deductions ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.create-agent-deductions')}</label>
        <input
          type="checkbox"
          checked={permissionData.create_agent_deductions}
          onChange={handleChange}
          id='create_agent_deductions'
          className='w-4 h-4'
          name='create_agent_deductions'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="view_agent_payment_request" className={`cursor-pointer ${permissionData.view_agent_payment_request ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.view-agent-payment-request')}</label>
        <input
          type="checkbox"
          checked={permissionData.view_agent_payment_request}
          onChange={handleChange}
          id='view_agent_payment_request'
          className='w-4 h-4'
          name='view_agent_payment_request'
        />
      </div>
      <div className='flex items-center w-full justify-between'>
        <label htmlFor="update_agent_payment_request" className={`cursor-pointer ${permissionData.update_agent_payment_request ? 'text-blue-500' : 'text-slate-600'} hover:text-blue-500`}>- {t('admin.permissions.update-agent-payment-request')}</label>
        <input
          type="checkbox"
          checked={permissionData.update_agent_payment_request}
          onChange={handleChange}
          id='update_agent_payment_request'
          className='w-4 h-4'
          name='update_agent_payment_request'
        />
      </div>

    </div>
  );
};

export default FormAgentPermission;
