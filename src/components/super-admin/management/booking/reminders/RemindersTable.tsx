/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faEllipsis, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faEye, faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import Link from 'next-intl/link'
import { Booking } from '@/lib/types/super-admin/bookingType';
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore';
import axios from 'axios';

interface Props {

    filteredTable: Booking[]

}

const RemindersTable: React.FC<Props> = ({ filteredTable }) => {

    const { operation, skeleton, selectedID, openOperation, closeOperation, isLoading, setIsLoading } = useAdminGlobalStore()

    const { openDeleteRemindersWarningMOdal, selectedReminders, setSelectedReminders, openConfirmBookingModal } = useAdminBookingStore()

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);

    const handleSelection = (booking: Booking) => {

        const isSelected = selectedReminders.some((selectedBooking) => selectedBooking.id === booking.id);

        if (isSelected) {
            const updatedSelectedBooking = selectedReminders.filter((selectedBooking) => selectedBooking.id !== booking.id);
            setSelectedReminders(updatedSelectedBooking);
        } else {
            const updatedSelectedBooking = [...selectedReminders, booking];
            setSelectedReminders(updatedSelectedBooking);

        }
    }

    const selectAllRows = () => {

        if (filteredTable.length === 0) return;
        let updatedSelectedBooking: Booking[];
        const isSelected = filteredTable.every((booking) =>
            selectedReminders.some((selectedBooking) => selectedBooking.id === booking.id)
        );

        if (isSelected) {
            // Unselect all rows on the current page
            updatedSelectedBooking = selectedReminders.filter((selectedBooking) =>
                filteredTable.every((booking) => booking.id !== selectedBooking.id)
            );
        } else {
            // Select all rows on the current page and keep existing selections
            updatedSelectedBooking = [
                ...selectedReminders,
                ...filteredTable.filter(
                    (booking) => !selectedReminders.some((selectedBooking) => selectedBooking.id === booking.id)
                ),
            ];
        }

        setSelectedReminders(updatedSelectedBooking);

    };

    useEffect(() => {
        const currentPageIds = filteredTable.map((booking) => booking.id);
        const areAllBookingSelected =
            currentPageIds.length > 0 &&
            currentPageIds.every((id) =>
                selectedReminders.some((booking) => booking.id === id)
            );
        setIsRowChecked(areAllBookingSelected);
    }, [selectedReminders, filteredTable])

    return (
        <table className="text-sm text-left text-gray-800 shadow-md w-full">
            <thead className="text-xs uppercase bg-slate-100 border">
                <tr>
                    <th scope='col' className='px-5 py-3'>
                        <input type="checkbox"
                            className='cursor-pointer w-4 h-4 outline-none'
                            title='Select all 10 rows'
                            checked={isRowChecked}
                            onChange={selectAllRows}
                        />
                    </th>
                    <th scope="col" className="px-5 py-3">{t('booking.name')}</th>
                    <th scope="col" className="px-5 py-3">{t('booking.client')}</th>
                    <th scope="col" className="px-5 py-3">{t('booking.supplier')}</th>
                    <th scope="col" className="px-5 py-3">{t('booking.schedule')}</th>
                    <th scope="col" className="px-5 py-3">{t('booking.price')}</th>
                    <th scope="col" className="px-5 py-3">{t('booking.operator')}</th>
                    <th scope="col" className="px-5 py-3">{t('booking.status')}</th>
                    <th scope="col" className="px-5 py-3">{t('booking.note')}</th>
                    <th scope="col" className="px-5 py-3">{t('booking.date')}</th>
                    <th scope="col" className="px-5 py-3">{t('global.operation')}</th>
                </tr>
            </thead>
            <tbody>
                {filteredTable && filteredTable.length > 0 ?
                    filteredTable.map(reminders => (
                        <tr className="bg-white border hover:bg-slate-50" key={reminders.id}>
                            <td className='px-5 py-3'>
                                <input type="checkbox" id={reminders.id}
                                    className='cursor-pointer w-4 h-4 outline-none'
                                    onChange={() => handleSelection(reminders)}
                                    checked={selectedReminders.some(selectedBooking => selectedBooking.id === reminders.id)}
                                />
                            </td>
                            <td className='px-5 py-3'>
                                <div className='h-5 w-36'>
                                    {reminders.name}
                                </div>
                            </td>
                            <td className='px-5 py-3'>
                                <div className='h-5 w-36'>
                                    {reminders.client.name}
                                </div>
                            </td>
                            <td className='px-5 py-3'>
                                <div className='h-5 w-36'>
                                    {reminders.supplier.name}
                                </div>
                            </td>
                            <td className='px-5 py-3'>
                                <div className='h-5 w-36'>
                                    {reminders.schedule[0].date} ({reminders.schedule[0].time})
                                </div>
                            </td>
                            <td className="px-5 py-3">
                                <div className='h-5 w-16'>
                                    {reminders.price}
                                </div>
                            </td>
                            <td className="px-5 py-3">
                                <div className='h-5 w-28'>
                                    {reminders.operator}
                                </div>
                            </td>
                            <td className="px-5 py-3">
                                <div className='h-5 w-28 uppercase'>
                                    {reminders.status}
                                </div>
                            </td>
                            <td className="px-5 py-3">
                                <div className='h-5 w-32'>
                                    {reminders.note}
                                </div>
                            </td>
                            <td className="px-5 py-3">
                                <div className='h-5 w-44'>
                                    {new Date(reminders.created_at).toLocaleString()}
                                </div>
                            </td>
                            <td className='py-3 relative px-5'>
                                <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer text-black' onClick={() => openOperation(reminders.id)} />
                                <ul className={`${operation && selectedID === reminders.id ? 'block' : 'hidden'} absolute bg-white p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-gray-600`}>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-green-500'>{tt('view')} <FontAwesomeIcon icon={faEye} /></li>
                                    <Link href={`/manage/booking/reminders/update/${reminders.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-blue-600'>{tt('update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-green-600' onClick={() => openConfirmBookingModal(reminders)}>{t('booking.reminders.confirm')} <FontAwesomeIcon icon={faTrashCan} /></li>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-red-600' onClick={() => openDeleteRemindersWarningMOdal(reminders)}>{tt('delete')} <FontAwesomeIcon icon={faTrashCan} /></li>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-black pt-2 border-t border-r-gray-700' onClick={() => closeOperation()}>{tt('close')} <FontAwesomeIcon icon={faXmark} /></li>
                                </ul>
                            </td>
                        </tr>
                    )) :
                    skeleton.map(item => (
                        <tr key={item}>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-md animate-pulse w-5 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-16 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-32 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-44 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-10 h-5'></div>
                            </td>
                        </tr>
                    ))
                }
            </tbody >
        </table >
    );
};

export default RemindersTable;
