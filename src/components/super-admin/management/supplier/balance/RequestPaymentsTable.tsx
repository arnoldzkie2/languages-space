import useGlobalStore from '@/lib/state/globalStore';
import { SupplierBalanceTransaction } from '@/lib/types/super-admin/supplierBalanceType';
import { faCheck, faEllipsis, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import React from 'react'
import ConfirmPaymentModal from './ConfirmPaymentModal';
import useSupplierBalanceStore from '@/lib/state/supplier/supplierBalanceStore';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
    filteredTable: SupplierBalanceTransaction[]
}

const RequestPaymentsTable = ({ filteredTable }: Props) => {

    const { openOperation, closeOperation, operation, selectedID, isLoading } = useGlobalStore()

    const openConfirmPaymentModal = useSupplierBalanceStore(s => s.openConfirmPaymentModal)

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)

    return (
        <table className="text-sm text-left text-muted-foreground shadow-md w-full">
            <thead className="text-xs uppercase bg-card border">
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
                {filteredTable.length < 1 ? <SkeletonTable /> : filteredTable.map(obj => (
                    <tr className="bg-card border hover:bg-muted" key={obj.id}>
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
                            <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer' onClick={() => openOperation(obj.id)} />
                            <ul className={`${operation && selectedID === obj.id ? 'block' : 'hidden'} absolute bg-card p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-muted-foreground`}>
                                {obj.status !== 'completed' && isAdminAllowed('update_supplier_payment_request') && <button
                                    onClick={() => openConfirmPaymentModal(obj)}
                                    disabled={isLoading}
                                    className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground'>
                                    {tt('paid')} <FontAwesomeIcon icon={faCheck} width={16} height={16} />
                                </button>}
                                <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground pt-2 border-t' onClick={() => closeOperation()}>{tt('close')} <FontAwesomeIcon icon={faXmark} /></li>
                            </ul>
                        </td>
                    </tr>
                ))}
            </tbody >
            <ConfirmPaymentModal />
        </table >
    );
}

const SkeletonTable = () => {

    const { skeleton } = useGlobalStore()

    return (
        <>
            {skeleton.map(item => (
                <tr key={item} className='border bg-card'>
                    <td className='py-3.5 px-6'>
                        <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
                    </td>
                    <td className='py-3.5 px-6'>
                        <Skeleton className='rounded-3xl w-28 h-5'></Skeleton>
                    </td>
                    <td className='py-3.5 px-6'>
                        <Skeleton className='rounded-3xl w-28 h-5'></Skeleton>
                    </td>
                    <td className='py-3.5 px-6'>
                        <Skeleton className='rounded-3xl w-40 h-5'></Skeleton>
                    </td>
                    <td className='py-3.5 px-6'>
                        <Skeleton className='rounded-3xl w-40 h-5'></Skeleton>
                    </td>
                    <td className='py-3.5 px-6'>
                        <Skeleton className='rounded-3xl w-44 h-5'></Skeleton>
                    </td>
                    <td className='py-3.5 px-6'>
                        <Skeleton className='rounded-3xl w-10 h-5'></Skeleton>
                    </td>
                </tr>
            ))
            }
        </>
    )
}


export default RequestPaymentsTable