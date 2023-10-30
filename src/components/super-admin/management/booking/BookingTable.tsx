/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faEye, faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import Link from 'next-intl/link'
import { Booking } from '@/lib/types/super-admin/bookingType';

interface Props {

    filteredTable: Booking[]

}

const BookingTable: React.FC<Props> = ({ filteredTable }) => {

    const { operation, skeleton, selectedID, openOperation, closeOperation, isLoading, setIsLoading } = useAdminGlobalStore()

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <table className="text-sm text-left text-gray-800 shadow-md w-full">
            <thead className="text-xs uppercase bg-slate-100 border">
                <tr>
                    <th scope="col" className="px-6 py-3">{t('booking.name')}</th>
                    <th scope="col" className="px-6 py-3">{t('booking.price')}</th>
                    <th scope="col" className="px-6 py-3">{t('booking.operator')}</th>
                    <th scope="col" className="px-6 py-3">{t('booking.note')}</th>
                    <th scope="col" className="px-6 py-3">{t('booking.date')}</th>
                    <th scope="col" className="px-6 py-3">{t('global.operation')}</th>
                </tr>
            </thead>
            <tbody>
                {filteredTable && filteredTable.length > 0 ?
                    filteredTable.map(booking => (
                        <tr className="bg-white border hover:bg-slate-50" key={booking.id}>
                            <td className='px-6 py-3'>
                                <div className='h-5 w-36'>
                                    {booking.name}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-28'>
                                    {booking.price}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-28'>
                                    {booking.operator}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-32'>
                                    {booking.note}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-44'>
                                    {new Date(booking.created_at).toLocaleString()}
                                </div>
                            </td>
                            <td className='py-3 relative px-6'>
                                <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer text-black' onClick={() => openOperation(booking.id)} />
                                <ul className={`${operation && selectedID === booking.id ? 'block' : 'hidden'} absolute bg-white p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-gray-600`}>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-green-500'>{tt('view')} <FontAwesomeIcon icon={faEye} /></li>
                                    <Link href={`/manage/booking/update/${booking.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-blue-600'>{tt('update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-red-600'>{tt('delete')} <FontAwesomeIcon icon={faTrashCan} /></li>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-black pt-2 border-t border-r-gray-700' onClick={() => closeOperation()}>{tt('close')} <FontAwesomeIcon icon={faXmark} /></li>
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
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                            </td>
                            <td className='py-3.5 px-6'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-32 h-5'></div>
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
            </tbody >
        </table >
    );
};

export default BookingTable;
