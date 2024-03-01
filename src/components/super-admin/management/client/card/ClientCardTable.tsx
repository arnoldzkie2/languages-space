/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faRotateRight, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faEye, faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link'
import useAdminClientCardStore from '@/lib/state/super-admin/clientCardStore';
import useGlobalStore from '@/lib/state/globalStore';
import { Skeleton } from '@/components/ui/skeleton';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import ViewCardAlert from '../../card/ViewCardAlert';
import { ClientCardProps } from '@/lib/types/super-admin/clientCardType';
import DeleteClientCardAlert from './DeleteClientCardAlert';

interface Props {

    filteredTable: ClientCardProps[]
    clientID: string
}

const ClientCardTable: React.FC<Props> = ({ filteredTable, clientID }) => {

    const { operation, selectedID, skeleton, openOperation, closeOperation, isLoading } = useGlobalStore()
    const { renewClientCard } = useAdminClientCardStore()
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)
    const t = useTranslations()

    return (
        <table className="text-sm text-left shadow-md w-full">
            <thead className="text-xs uppercase bg-card border">
                <tr>
                    <th scope="col" className="px-6 py-3">{t('info.name')}</th>
                    <th scope="col" className="px-6 py-3">{t('card.price')}</th>
                    <th scope="col" className="px-6 py-3">{t('balance.h1')}</th>
                    <th scope="col" className="px-6 py-3">{t('card.validity')}</th>
                    <th scope="col" className="px-6 py-3">{t('info.date.h1')}</th>
                    <th scope="col" className="px-6 py-3">{t('operation.h1')}</th>
                </tr>
            </thead>
            <tbody>
                {filteredTable && filteredTable.length > 0 ?
                    filteredTable.map(card => (
                        <tr className="bg-card border hover:bg-muted" key={card.id}>
                            <td className='px-6 py-3'>
                                <div className='h-5 w-36'>
                                    {card.name}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-28'>
                                    {Number(card.price)}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-28'>
                                    {card.balance}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-32'>
                                    {card.validity}
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
                                    {isAdminAllowed('renew_cards') && <button disabled={isLoading} onClick={(e) => renewClientCard({ e, clientCardID: card.id, clientID })} className={`flex mb-1 justify-between items-center cursor-pointer hover:text-foreground`}>{t('operation.renew')} {isLoading ?
                                        <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : <FontAwesomeIcon icon={faRotateRight} width={16} height={16} />}</button>}
                                    <ViewCardAlert cardID={card.cardID} />
                                    {isAdminAllowed('update_client_cards') && <Link href={`/admin/manage/client/card/${clientID}/update/${card.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground'>{t('operation.update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>}
                                    <DeleteClientCardAlert card={card} clientID={clientID} />
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground pt-2 border-t' onClick={() => closeOperation()}>{t('operation.close')} <FontAwesomeIcon icon={faXmark} /></li>
                                </ul>
                            </td>
                        </tr>
                    )) :
                    skeleton.map(item => (
                        <tr key={item} className='bg-card borderra'>
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
                                <Skeleton className='rounded-3xl w-32 h-5'></Skeleton>
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
            </tbody >
        </table >
    );
};

export default ClientCardTable;
