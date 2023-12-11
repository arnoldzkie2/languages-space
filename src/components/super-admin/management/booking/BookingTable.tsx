/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faEllipsis, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import Link from 'next/link'
import { Booking } from '@/lib/types/super-admin/bookingType';
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore';
import axios from 'axios';

interface Props {

    filteredTable: Booking[]

}

const BookingTable: React.FC<Props> = ({ filteredTable }) => {

    const { operation, skeleton, selectedID, openOperation, closeOperation, isLoading, setIsLoading } = useAdminGlobalStore()

    const { openDeleteBookingWarningMOdal, getBookings, selectedBookings, setSelectedBookings } = useAdminBookingStore()
    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);

    const cancelBooking = async (e: any, bookingID: string) => {

        e.preventDefault()
        try {

            setIsLoading(true)
            const { data } = await axios.delete('/api/booking', {
                params: { bookingID, type: 'cancel' }
            })

            if (data.ok) {
                setIsLoading(false)
                getBookings()
            }

        } catch (error) {
            setIsLoading(false)
            console.log(error);
            alert('Something went wrong')
        }
    }

    const handleSelection = (booking: Booking) => {

        const isSelected = selectedBookings.some((selectedBooking) => selectedBooking.id === booking.id);

        if (isSelected) {
            const updatedSelectedBooking = selectedBookings.filter((selectedBooking) => selectedBooking.id !== booking.id);
            setSelectedBookings(updatedSelectedBooking);
        } else {
            const updatedSelectedBooking = [...selectedBookings, booking];
            setSelectedBookings(updatedSelectedBooking);

        }
    };


    const selectAllRows = () => {

        if (filteredTable.length === 0) return;

        let updatedSelectedBooking: Booking[];

        const isSelected = filteredTable.every((booking) =>
            selectedBookings.some((selectedBooking) => selectedBooking.id === booking.id)
        );

        if (isSelected) {
            // Unselect all rows on the current page
            updatedSelectedBooking = selectedBookings.filter((selectedBooking) =>
                filteredTable.every((booking) => booking.id !== selectedBooking.id)
            );
        } else {
            // Select all rows on the current page and keep existing selections
            updatedSelectedBooking = [
                ...selectedBookings,
                ...filteredTable.filter(
                    (booking) => !selectedBookings.some((selectedBooking) => selectedBooking.id === booking.id)
                ),
            ];
        }

        setSelectedBookings(updatedSelectedBooking);

    };

    useEffect(() => {
        const currentPageIds = filteredTable.map((booking) => booking.id);
        const areAllBookingSelected =
            currentPageIds.length > 0 &&
            currentPageIds.every((id) =>
                selectedBookings.some((booking) => booking.id === id)
            );
        setIsRowChecked(areAllBookingSelected);
    }, [selectedBookings, filteredTable]);


    return (
        <table className="text-sm text-left text-gray-800 shadow-md w-full">
            <thead className="text-xs uppercase bg-slate-100 border">
                <tr>
                    <th scope='col' className='px-2 py-3'>
                        <input type="checkbox"
                            className='cursor-pointer w-4 h-4 outline-none'
                            title='Select all 10 rows'
                            checked={isRowChecked}
                            onChange={selectAllRows}
                        />
                    </th>
                    <th scope="col" className="px-2 py-3">{tt('name')}</th>
                    <th scope="col" className="px-2 py-3">{tt('client')}</th>
                    <th scope="col" className="px-2 py-3">{tt('supplier')}</th>
                    <th scope="col" className="px-2 py-3">{tt('card')}</th>
                    <th scope="col" className="px-2 py-3">{tt('schedule')}</th>
                    <th scope="col" className="px-2 py-3">{tt('quantity')}</th>
                    <th scope="col" className="px-2 py-3">{tt('price')}</th>
                    <th scope="col" className="px-2 py-3">{tt('operator')}</th>
                    <th scope="col" className="px-2 py-3">{tt('status')}</th>
                    <th scope="col" className="px-2 py-3">{tt('note')}</th>
                    <th scope="col" className="px-2 py-3">{tt('date')}</th>
                    <th scope="col" className="px-2 py-3">{t('global.operation')}</th>
                </tr>
            </thead>
            <tbody>
                {filteredTable && filteredTable.length > 0 ?
                    filteredTable.map(booking => (
                        <tr className="bg-white border hover:bg-slate-50" key={booking.id}>
                            <td className='px-2 py-3'>
                                <input type="checkbox" id={booking.id}
                                    className='cursor-pointer w-4 h-4 outline-none'
                                    onChange={() => handleSelection(booking)}
                                    checked={selectedBookings.some(selectedBooking => selectedBooking.id === booking.id)}
                                />
                            </td>
                            <td className='px-2 overflow-x-auto py-3'>
                                <div className='h-5 whitespace-nowrap w-36'>
                                    {booking.name}
                                </div>
                            </td>
                            <td className='px-2 overflow-x-auto py-3'>
                                <div className='h-5 whitespace-nowrap w-36'>
                                    {booking.client.username}
                                </div>
                            </td>
                            <td className='px-2 overflow-x-auto py-3'>
                                <div className='h-5 whitespace-nowrap w-36'>
                                    {booking.supplier.name}
                                </div>
                            </td>
                            <td className='px-2 overflow-x-auto py-3'>
                                <div className='h-5 whitespace-nowrap w-36'>
                                    {booking.card_name}
                                </div>
                            </td>
                            <td className='px-2 overflow-x-auto py-3'>
                                <div className='h-5 whitespace-nowrap w-36'>
                                    {booking.schedule.date} ({booking.schedule.time})
                                </div>
                            </td>
                            <td className="px-2 overflow-x-auto py-3">
                                <div className='h-5 whitespace-nowrap w-12'>
                                    {booking.quantity}
                                </div>
                            </td>
                            <td className="px-2 overflow-x-auto py-3">
                                <div className='h-5 whitespace-nowrap w-16'>
                                    {booking.price}
                                </div>
                            </td>
                            <td className="px-2 overflow-x-auto py-3">
                                <div className='h-5 whitespace-nowrap w-28'>
                                    {booking.operator}
                                </div>
                            </td>
                            <td className="px-2 overflow-x-auto py-3">
                                <div className='h-5 whitespace-nowrap w-28 uppercase'>
                                    {booking.status}
                                </div>
                            </td>
                            <td className="px-2 py-3 overflow-x-auto">
                                <div className='h-5 w-32 whitespace-nowrap'>
                                    {booking.note}
                                </div>
                            </td>
                            <td className="px-2 py-3 overflow-x-auto">
                                <div className='h-5 w-44 whitespace-nowrap'>
                                    {new Date(booking.created_at).toLocaleString()}
                                </div>
                            </td>
                            <td className='py-3 relative px-2'>
                                <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer text-black' onClick={() => openOperation(booking.id)} />
                                <ul className={`${operation && selectedID === booking.id ? 'block' : 'hidden'} absolute bg-white p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-gray-600`}>
                                    <Link href={`/manage/booking/update/${booking.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-blue-600'>{tt('update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>
                                    {booking.status === 'pending' && <button disabled={isLoading} className='flex mb-1 justify-between items-center cursor-dpointer hover:text-red-600' onClick={(e: any) => cancelBooking(e, booking.id)}>
                                        {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : <div className='flex items-center w-full justify-between'>
                                            {tt('cancel')} <FontAwesomeIcon icon={faBan} />
                                        </div>}
                                    </button>}
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-red-600' onClick={() => openDeleteBookingWarningMOdal(booking)}>{tt('delete')} <FontAwesomeIcon icon={faTrashCan} /></li>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-black pt-2 border-t border-r-gray-700' onClick={() => closeOperation()}>{tt('close')} <FontAwesomeIcon icon={faXmark} /></li>
                                </ul>
                            </td>
                        </tr>
                    )) :
                    skeleton.map(item => (
                        <tr key={item}>
                            <td className='py-3.5 px-2'>
                                <div className='bg-slate-200 rounded-md animate-pulse w-5 h-5'></div>
                            </td>
                            <td className='py-3.5 px-2'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                            </td>
                            <td className='py-3.5 px-2'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                            </td>
                            <td className='py-3.5 px-2'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                            </td>
                            <td className='py-3.5 px-2'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                            </td>
                            <td className='py-3.5 px-2'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                            </td>
                            <td className='py-3.5 px-2'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-12 h-5'></div>
                            </td>
                            <td className='py-3.5 px-2'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-16 h-5'></div>
                            </td>
                            <td className='py-3.5 px-2'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                            </td>
                            <td className='py-3.5 px-2'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                            </td>
                            <td className='py-3.5 px-2'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-32 h-5'></div>
                            </td>
                            <td className='py-3.5 px-2'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-44 h-5'></div>
                            </td>
                            <td className='py-3.5 px-2'>
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
