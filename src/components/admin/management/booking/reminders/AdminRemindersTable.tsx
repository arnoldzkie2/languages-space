/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEllipsis, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link'
import { Booking } from '@/lib/types/super-admin/bookingType';
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore';
import useGlobalStore from '@/lib/state/globalStore';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';

interface Props {

    filteredTable: Booking[]

}

const AdminRemindersTable: React.FC<Props> = ({ filteredTable }) => {

    const { operation, skeleton, selectedID, openOperation, closeOperation } = useGlobalStore()

    const { openDeleteRemindersWarningMOdal, selectedReminders, setSelectedReminders } = useAdminBookingStore()
    const permissions = useAdminPageStore(s => s.permissions)
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
                    <th scope='col' className='px-3 py-3'>
                        <input type="checkbox"
                            className='cursor-pointer w-4 h-4 outline-none'
                            title='Select all 10 rows'
                            checked={isRowChecked}
                            onChange={selectAllRows}
                        />
                    </th>
                    <th scope="col" className="px-3 py-3">{tt('name')}</th>
                    <th scope="col" className="px-3 py-3">{tt('price')}</th>
                    <th scope="col" className="px-3 py-3">{tt('operator')}</th>
                    <th scope="col" className="px-3 py-3">{tt('status')}</th>
                    <th scope="col" className="px-3 py-3">{tt('note')}</th>
                    <th scope="col" className="px-3 py-3">{tt('date')}</th>
                    <th scope="col" className="px-3 py-3">{t('global.operation')}</th>
                </tr>
            </thead>
            <tbody>
                {filteredTable && filteredTable.length > 0 ?
                    filteredTable.map(reminders => (
                        <tr className="bg-white border hover:bg-slate-50" key={reminders.id}>
                            <td className='px-3 py-3'>
                                <input type="checkbox" id={reminders.id}
                                    className='cursor-pointer w-4 h-4 outline-none'
                                    onChange={() => handleSelection(reminders)}
                                    checked={selectedReminders.some(selectedBooking => selectedBooking.id === reminders.id)}
                                />
                            </td>
                            <td className='px-3 overflow-x-auto py-3'>
                                <div className='h-5 whitespace-nowrap w-36'>
                                    {reminders.name}
                                </div>
                            </td>
                            <td className="px-3 overflow-x-auto py-3">
                                <div className='h-5 whitespace-nowrap w-16'>
                                    {reminders.price}
                                </div>
                            </td>
                            <td className="px-3 overflow-x-auto py-3">
                                <div className='h-5 whitespace-nowrap w-28'>
                                    {reminders.operator}
                                </div>
                            </td>
                            <td className="px-3 overflow-x-auto py-3">
                                <div className='h-5 whitespace-nowrap w-28 uppercase'>
                                    {reminders.status}
                                </div>
                            </td>
                            <td className="px-3 py-3 overflow-x-auto">
                                <div className='h-5 w-32 whitespace-nowrap'>
                                    {reminders.note}
                                </div>
                            </td>
                            <td className="px-3 py-3 overflow-x-auto">
                                <div className='h-5 w-44 whitespace-nowrap'>
                                    {new Date(reminders.created_at).toLocaleString()}
                                </div>
                            </td>
                            <td className='py-3 relative px-3'>
                                <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer text-black' onClick={() => openOperation(reminders.id)} />
                                <ul className={`${operation && selectedID === reminders.id ? 'block' : 'hidden'} absolute bg-white p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-gray-600`}>
                                    {permissions?.update_reminders && <Link href={`/admin/manage/booking/reminders/update/${reminders.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-blue-600'>{tt('update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>
                                    }
                                    {permissions?.delete_reminders && <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-red-600' onClick={() => openDeleteRemindersWarningMOdal(reminders)}>{tt('delete')} <FontAwesomeIcon icon={faTrashCan} /></li>
                                    }
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-black pt-2 border-t border-r-gray-700' onClick={() => closeOperation()}>{tt('close')} <FontAwesomeIcon icon={faXmark} /></li>
                                </ul>
                            </td>
                        </tr>
                    )) :
                    skeleton.map(item => (
                        <tr key={item}>
                            <td className='py-3.5 px-3'>
                                <div className='bg-slate-200 rounded-md animate-pulse w-5 h-5'></div>
                            </td>
                            <td className='py-3.5 px-3'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                            </td>
                            <td className='py-3.5 px-3'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                            </td>
                            <td className='py-3.5 px-3'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                            </td>
                            <td className='py-3.5 px-3'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                            </td>
                            <td className='py-3.5 px-3'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                            </td>
                            <td className='py-3.5 px-3'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-16 h-5'></div>
                            </td>
                            <td className='py-3.5 px-3'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-24 h-5'></div>
                            </td>
                            <td className='py-3.5 px-3'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-24 h-5'></div>
                            </td>
                            <td className='py-3.5 px-3'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-32 h-5'></div>
                            </td>
                            <td className='py-3.5 px-3'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-44 h-5'></div>
                            </td>
                            <td className='py-3.5 px-3'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-10 h-5'></div>
                            </td>
                        </tr>
                    ))
                }
            </tbody >
        </table >
    );
};

export default AdminRemindersTable;
