import useGlobalStore from '@/lib/state/globalStore';
import { SupplierBalanceTransaction } from '@/lib/types/super-admin/supplierBalanceType';
import { faCheck, faEllipsis, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import React from 'react'
import ConfirmPaymentModal from './ConfirmPaymentModal';
import useSupplierBalanceStore from '@/lib/state/supplier/supplierBalanceStore';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import { Skeleton } from '@/components/ui/skeleton';
import TruncateTextModal from '@/components/global/TruncateTextModal';

interface Props {
    filteredTable: SupplierBalanceTransaction[]
}

const RequestPaymentsTable = ({ filteredTable }: Props) => {

    const { openOperation, closeOperation, operation, selectedID, isLoading, returnTruncateText, openTruncateTextModal } = useGlobalStore()

    const openConfirmPaymentModal = useSupplierBalanceStore(s => s.openConfirmPaymentModal)

    const t = useTranslations()

    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)

    return (
        <table className="text-sm text-left text-muted-foreground shadow-md w-full">
            <thead className="text-xs uppercase bg-card border">
                <tr>
                    <th scope="col" className="px-6 py-3">{t('info.name')}</th>
                    <th scope="col" className="px-6 py-3">{t('balance.amount')}</th>
                    <th scope="col" className="px-6 py-3">{t('status.h1')}</th>
                    <th scope="col" className="px-6 py-3">{t('balance.payment.address')}</th>
                    <th scope="col" className="px-6 py-3">{t('info.paid_by')}</th>
                    <th scope="col" className="px-6 py-3">{t('info.date.h1')}</th>
                    <th scope="col" className="px-6 py-3">{t('operation.h1')}</th>
                </tr>
            </thead>
            <tbody>
                {filteredTable.length < 1 ? <SkeletonTable /> : filteredTable.map(obj => (
                    <tr className="bg-card border hover:bg-muted" key={obj.id}>
                        <td className='px-6 py-3'>
                            <div onClick={() => openTruncateTextModal(obj.balance.supplier.name)} className='h-5 cursor-pointer w-36 '>
                                {returnTruncateText(obj.balance.supplier.name, 15)}
                            </div>
                        </td>
                        <td className="px-6 py-3">
                            <div onClick={() => openTruncateTextModal(obj.amount)} className='h-5 cursor-pointer w-28'>
                                {returnTruncateText(obj.amount, 10)}
                            </div>
                        </td>
                        <td className="px-6 py-3">
                            <div onClick={() => openTruncateTextModal(obj.status)} className='h-5 cursor-pointer w-28'>
                                {returnTruncateText(obj.status, 10)}
                            </div>
                        </td>
                        <td className="px-6 py-3">
                            <div onClick={() => openTruncateTextModal(obj.payment_address)} className='h-5 cursor-pointer w-40'>
                                {returnTruncateText(obj.payment_address, 10)}
                            </div>
                        </td>
                        <td className="px-6 py-3">
                            <div onClick={() => openTruncateTextModal(obj.paid_by || '')} className='h-5 cursor-pointer w-40'>
                                {returnTruncateText(obj.paid_by || '', 10)}
                            </div>
                        </td>
                        <td className="px-6 py-3">
                            <div onClick={() => openTruncateTextModal(obj.status)} className='h-5 cursor-pointer w-44'>
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
                                    {t('info.paid')} <FontAwesomeIcon icon={faCheck} width={16} height={16} />
                                </button>}
                                <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground pt-2 border-t' onClick={() => closeOperation()}>{t('operation.close')} <FontAwesomeIcon icon={faXmark} /></li>
                            </ul>
                        </td>
                    </tr>
                ))}
            </tbody >
            <TruncateTextModal />
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