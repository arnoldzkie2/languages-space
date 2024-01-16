import useGlobalStore from '@/lib/state/globalStore';
import { SupplierBalanceTransaction } from '@/lib/types/super-admin/supplierBalanceType';
import { faCheck, faEllipsis, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import React from 'react'
import useSupplierBalanceStore from '@/lib/state/supplier/supplierBalanceStore';
import ConfirmPaymentModal from '@/components/super-admin/management/supplier/balance/ConfirmPaymentModal';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';

interface Props {
    filteredTable: SupplierBalanceTransaction[]
}

const RequestPaymentsTable = ({ filteredTable }: Props) => {

    const { openOperation, closeOperation, operation, selectedID, isLoading } = useGlobalStore()

    const openConfirmPaymentModal = useSupplierBalanceStore(s => s.openConfirmPaymentModal)
    const permissions = useAdminPageStore(s => s.permissions)
    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <table className="text-sm text-left text-gray-800 shadow-md w-full">
            <thead className="text-xs uppercase bg-slate-100 border">
                <tr>
                    <th scope="col" className="px-6 py-3">{tt('name')}</th>
                    <th scope="col" className="px-6 py-3">{tt('amount')}</th>
                    <th scope="col" className="px-6 py-3">{tt('status')}</th>
                    <th scope="col" className="px-6 py-3">{tt('payment')}</th>
                    <th scope="col" className="px-6 py-3">{tt('paid-by')}</th>
                    <th scope="col" className="px-6 py-3">{tt('date')}</th>
                    <th scope="col" className="px-6 py-3">{t('global.operation')}</th>
                </tr>
            </thead>
            <tbody>
                {filteredTable.length < 1 ? <Skeleton /> : filteredTable.map(obj => (
                    <tr className="bg-white border hover:bg-slate-50" key={obj.id}>
                        <td className='px-6 py-3'>
                            <div className='h-5 w-36'>
                                {obj.balance.supplier.name}
                            </div>
                        </td>
                        <td className="px-6 py-3">
                            <div className='h-5 w-28'>
                                {obj.amount}
                            </div>
                        </td>
                        <td className="px-6 py-3">
                            <div className='h-5 w-28'>
                                {obj.status}
                            </div>
                        </td>
                        <td className="px-6 py-3">
                            <div className='h-5 w-40'>
                                {obj.payment_address}
                            </div>
                        </td>
                        <td className="px-6 py-3">
                            <div className='h-5 w-40'>
                                {obj.paid_by}
                            </div>
                        </td>
                        <td className="px-6 py-3">
                            <div className='h-5 w-44'>
                                {new Date(obj.created_at).toLocaleString()}
                            </div>
                        </td>
                        <td className='py-3 relative px-6'>
                            <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer text-black' onClick={() => openOperation(obj.id)} />
                            <ul className={`${operation && selectedID === obj.id ? 'block' : 'hidden'} absolute bg-white p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-gray-600`}>
                                {obj.status !== 'completed' && permissions?.update_supplier_payment_request && <button
                                    onClick={() => openConfirmPaymentModal(obj)}
                                    disabled={isLoading}
                                    className='flex mb-1 justify-between items-center cursor-pointer hover:text-green-500'>
                                    {tt('paid')} <FontAwesomeIcon icon={faCheck} width={16} height={16} />
                                </button>}
                                <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-black pt-2 border-t border-r-gray-700' onClick={() => closeOperation()}>{tt('close')} <FontAwesomeIcon icon={faXmark} /></li>
                            </ul>
                        </td>
                    </tr>
                ))}
            </tbody >
            <ConfirmPaymentModal />
        </table >
    );
}

const Skeleton = () => {

    const { skeleton } = useGlobalStore()

    return (
        <>
            {skeleton.map(item => (
                <tr key={item}>
                    <td className='py-3.5 px-6'>
                        <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                    </td>
                    <td className='py-3.5 px-6'>
                        <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                    </td>
                    <td className='py-3.5 px-6'>
                        <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                    </td>
                    <td className='py-3.5 px-6'>
                        <div className='bg-slate-200 rounded-3xl animate-pulse w-40 h-5'></div>
                    </td>
                    <td className='py-3.5 px-6'>
                        <div className='bg-slate-200 rounded-3xl animate-pulse w-44 h-5'></div>
                    </td>
                    <td className='py-3.5 px-6'>
                        <div className='bg-slate-200 rounded-3xl animate-pulse w-10 h-5'></div>
                    </td>
                </tr>
            ))
            }
        </>
    )
}


export default RequestPaymentsTable