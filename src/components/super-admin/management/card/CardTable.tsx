/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faEye, faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link'
import { ClientCardList } from '@/lib/types/super-admin/clientCardType';
import useAdminCardStore from '@/lib/state/super-admin/cardStore';
import useGlobalStore from '@/lib/state/globalStore';
import { Skeleton } from '@/components/ui/skeleton';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import TruncateTextModal from '@/components/global/TruncateTextModal';
import ViewCardAlert from './ViewCardAlert';

interface Props {
    filteredTable: ClientCardList[]
}

const CardTable: React.FC<Props> = ({ filteredTable }) => {

    const { operation, selectedID, skeleton, openOperation, closeOperation, returnTruncateText, openTruncateTextModal } = useGlobalStore()
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)

    const { openViewCard, openDeleteCardModal } = useAdminCardStore()

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')
    return (
        <table className="text-sm text-left shadow-md w-full text-muted-foreground">
            <thead className="text-xs uppercase bg-card border">
                <tr>
                    <th scope="col" className="px-6 py-3">{tt('name')}</th>
                    <th scope="col" className="px-6 py-3">{tt('price')}</th>
                    <th scope="col" className="px-6 py-3">{tt('balance')}</th>
                    <th scope="col" className="px-6 py-3">{t('client-card.validity')}</th>
                    <th scope="col" className="px-6 py-3">{t('client-card.sold')}</th>
                    <th scope="col" className="px-6 py-3">{tt('client')}</th>
                    <th scope="col" className="px-6 py-3">{tt('date')}</th>
                    <th scope="col" className="px-6 py-3">{t('global.operation')}</th>
                </tr>
            </thead>
            <tbody>
                {filteredTable && filteredTable.length > 0 ?
                    filteredTable.map(card => (
                        <tr className="border bg-card hover:bg-muted hover:text-foreground" key={card.id}>
                            <td className='px-6 py-3'>
                                <div className='h-5 w-36 cursor-pointer hover:text-primary' onClick={() => openTruncateTextModal(card.name)}>
                                    {returnTruncateText(card.name, 15)}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-20'>
                                    ¥{card.price}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-20'>
                                    {card.balance}
                                </div>
                            </td>

                            <td className="px-6 py-3">
                                <div className='h-5 w-20'>
                                    {card.validity}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-20'>
                                    {card.sold}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-20'>
                                    {card.active.length}
                                </div>
                            </td>

                            <td className="px-6 py-3">
                                <div className='h-5 w-44'>
                                    {new Date(card.created_at).toLocaleString()}
                                </div>
                            </td>
                            <td className='py-3 relative px-6'>
                                <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer' onClick={() => openOperation(card.id)} />
                                <ul className={`${operation && selectedID === card.id ? 'block' : 'hidden'} absolute bg-card p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-muted-foreground`}>
                                    <ViewCardAlert cardID={card.id} />
                                    {isAdminAllowed('update_cards') && <Link href={`/admin/manage/card/update/${card.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground'>{tt('update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>}
                                    {isAdminAllowed('delete_cards') && <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground' onClick={() => openDeleteCardModal(card)}>{tt('delete')} <FontAwesomeIcon icon={faTrashCan} /></li>}
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground pt-2 border-t' onClick={() => closeOperation()}>{tt('close')} <FontAwesomeIcon icon={faXmark} /></li>
                                </ul>
                            </td>
                        </tr>
                    )) :
                    skeleton.map(item => (
                        <tr key={item} className='border bg-card'>
                            <td className='py-3.5 px-6'>
                                <Skeleton className='rounded-3xl w-36 h-5' />
                            </td>
                            <td className='py-3.5 px-6'>
                                <Skeleton className='rounded-3xl w-20 h-5' />
                            </td>
                            <td className='py-3.5 px-6'>
                                <Skeleton className='rounded-3xl w-20 h-5' />
                            </td>

                            <td className='py-3.5 px-6'>
                                <Skeleton className='rounded-3xl w-20 h-5' />
                            </td>
                            <td className='py-3.5 px-6'>
                                <Skeleton className='rounded-3xl w-20 h-5' />
                            </td>
                            <td className='py-3.5 px-6'>
                                <Skeleton className='rounded-3xl w-20 h-5' />
                            </td>
                            <td className='py-3.5 px-6'>
                                <Skeleton className='rounded-3xl w-44 h-5' />
                            </td>
                            <td className='py-3.5 px-6'>
                                <Skeleton className='rounded-3xl w-10 h-5' />
                            </td>
                        </tr>
                    ))
                }
            </tbody >
            <TruncateTextModal />
        </table >
    );
};

export default CardTable;
