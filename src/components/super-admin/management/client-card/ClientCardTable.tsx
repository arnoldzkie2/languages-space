/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faEye, faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import useAdminClientStore from '@/lib/state/super-admin/clientStore';
import { Client } from '@/lib/types/super-admin/clientType';
import Link from 'next-intl/link'
import { ClientCard } from '@/lib/types/super-admin/clientCardType';
import useAdminClientCardStore from '@/lib/state/super-admin/clientCardStore';

interface Props {

    filteredTable: ClientCard[]

}

const ClientCardTable: React.FC<Props> = ({ filteredTable }) => {

    const [skeleton, setSkeleton] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    const { operation, selectedID, openOperation, closeOperation } = useAdminGlobalStore()

    const { openViewCard, openDeleteCardModal } = useAdminClientCardStore()

    const t = useTranslations('super-admin')
    return (
        <table className="text-sm text-left text-gray-800 shadow-md w-full">
            <thead className="text-xs uppercase bg-slate-100 border">
                <tr>
                    <th scope="col" className="px-6 py-3">{t('client-card.name')}</th>
                    <th scope="col" className="px-6 py-3">{t('client-card.price')}</th>
                    <th scope="col" className="px-6 py-3">{t('client-card.validity')}</th>
                    <th scope="col" className="px-6 py-3">{t('client-card.date')}</th>
                    <th scope="col" className="px-6 py-3">{t('global.operation')}</th>
                </tr>
            </thead>
            <tbody>
                {filteredTable && filteredTable.length > 0 ?
                    filteredTable.map(card => (
                        <tr className="bg-white border hover:bg-slate-50" key={card.id}>
                            <td className='px-6 py-3'>
                                <div className='h-5 w-36'>
                                    {card.name}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-28'>
                                    {card.price}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-32'>
                                    {card.validity}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-40'>
                                    {new Date(card.date).toLocaleString()}
                                </div>
                            </td>
                            <td className='py-3 relative px-6'>
                                <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer text-black' onClick={() => openOperation(card.id)} />
                                <ul className={`${operation && selectedID === card.id ? 'block' : 'hidden'} absolute bg-white p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-gray-600`}>
                                    <li onClick={() => openViewCard(card)} className='flex mb-1 justify-between items-center cursor-pointer hover:text-green-500'>{t('operation.view')} <FontAwesomeIcon icon={faEye} /></li>
                                    <Link href={`/manage/client/card/update/${card.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-blue-600'>{t('operation.update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-red-600' onClick={() => openDeleteCardModal(card)}>{t('operation.delete')} <FontAwesomeIcon icon={faTrashCan} /></li>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-black pt-2 border-t border-r-gray-700' onClick={() => closeOperation()}>{t('operation.close')} <FontAwesomeIcon icon={faXmark} /></li>
                                </ul>
                            </td>
                        </tr>
                    )) :
                    skeleton.map(item => (
                        <tr key={item}>
                            <td className='py-3.5 px-6'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                            </td>
                            <td className='py-3.5 px-6'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                            </td>
                            <td className='py-3.5 px-6'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-32 h-5'></div>
                            </td>
                            <td className='py-3.5 px-6'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-40 h-5'></div>
                            </td>
                            <td className='py-3.5 px-6'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-10 h-5'></div>
                            </td>
                        </tr>
                    ))
                }
            </tbody >
        </table >
    );
};

export default ClientCardTable;
