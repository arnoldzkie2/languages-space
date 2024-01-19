/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faEllipsis, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link'
import { BookingRequest } from '@/lib/types/super-admin/bookingType';
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore';
import axios from 'axios';
import useGlobalStore from '@/lib/state/globalStore';
import TruncateTextModal from '@/components/global/TruncateTextModal';

interface Props {
    filteredTable: BookingRequest[]
}

const BookingRequestTable: React.FC<Props> = ({ filteredTable }) => {

    const { operation, skeleton, selectedID, openOperation, closeOperation, isLoading, setIsLoading, returnTruncateText, openTruncateTextModal } = useGlobalStore()

    const { openDeleteBookingReqeustWarningMOdal, getBookingRequests, selectedBookingRequests, setSelectedBookingRequests } = useAdminBookingStore()
    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);

    const cancelBookingRequest = async (e: any, bookingRequestID: string) => {

        e.preventDefault()
        try {

            setIsLoading(true)
            const { data } = await axios.post('/api/booking/request/cancel', {
                bookingRequestID
            })

            if (data.ok) {
                setIsLoading(false)
                getBookingRequests()
            }

        } catch (error) {
            setIsLoading(false)
            console.log(error);
            alert('Something went wrong')
        }
    }

    const handleSelection = (booking: BookingRequest) => {

        const isSelected = selectedBookingRequests.some((selectedBooking) => selectedBooking.id === booking.id);

        if (isSelected) {
            const updatedSelectedBooking = selectedBookingRequests.filter((selectedBooking) => selectedBooking.id !== booking.id);
            setSelectedBookingRequests(updatedSelectedBooking);
        } else {
            const updatedSelectedBooking = [...selectedBookingRequests, booking];
            setSelectedBookingRequests(updatedSelectedBooking);

        }
    };


    const selectAllRows = () => {

        if (filteredTable.length === 0) return;

        let updatedSelectedBooking: BookingRequest[];

        const isSelected = filteredTable.every((booking) =>
            selectedBookingRequests.some((selectedBooking) => selectedBooking.id === booking.id)
        );

        if (isSelected) {
            // Unselect all rows on the current page
            updatedSelectedBooking = selectedBookingRequests.filter((selectedBooking) =>
                filteredTable.every((booking) => booking.id !== selectedBooking.id)
            );
        } else {
            // Select all rows on the current page and keep existing selections
            updatedSelectedBooking = [
                ...selectedBookingRequests,
                ...filteredTable.filter(
                    (booking) => !selectedBookingRequests.some((selectedBooking) => selectedBooking.id === booking.id)
                ),
            ];
        }

        setSelectedBookingRequests(updatedSelectedBooking);

    };

    useEffect(() => {
        const currentPageIds = filteredTable.map((booking) => booking.id);
        const areAllBookingSelected =
            currentPageIds.length > 0 &&
            currentPageIds.every((id) =>
                selectedBookingRequests.some((booking) => booking.id === id)
            );
        setIsRowChecked(areAllBookingSelected);
    }, [selectedBookingRequests, filteredTable]);

    return (
        <table className="text-sm text-left text-gray-800 shadow-md w-full">
            <TruncateTextModal />
            <thead className="text-xs uppercase bg-slate-100 border">
                <tr>
                    <th scope='col' className='px-2 py-3'>
                        <input type="checkbox"
                            className='cursor-pointer w-3.5 h-3.5 outline-none'
                            title='Select all 10 rows'
                            checked={isRowChecked}
                            onChange={selectAllRows}
                        />
                    </th>
                    <th scope="col" className="px-2 py-3">{tt('client')}</th>
                    <th scope="col" className="px-2 py-3">{tt('supplier')}</th>
                    <th scope="col" className="px-2 py-3">{tt('card')}</th>
                    <th scope="col" className="px-2 py-3">{tt('schedule')}</th>
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
                                    className='cursor-pointer w-3.5 h-3.5 outline-none'
                                    onChange={() => handleSelection(booking)}
                                    checked={selectedBookingRequests.some(selectedBooking => selectedBooking.id === booking.id)}
                                />
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
                                    {booking.date} ({booking.time})
                                </div>
                            </td>
                            <td className="px-2 overflow-x-auto py-3">
                                <div className='h-5 whitespace-nowrap w-28'>
                                    {booking.operator}
                                </div>
                            </td>
                            <td className="px-2 overflow-x-auto py-3">
                                <div className='h-5 whitespace-nowrap w-28'>
                                    {booking.status}
                                </div>
                            </td>
                            <td className="px-2 py-3 overflow-x-auto">
                                {booking.note &&
                                    <div className={`h-5 w-36 cursor-pointer hover:text-blue-500`} onClick={() => openTruncateTextModal(booking.note || 'No Data')}>
                                        {returnTruncateText(booking.note || '', 15)}
                                    </div>
                                }
                            </td>
                            <td className="px-2 py-3 overflow-x-auto">
                                <div className='h-5 w-44 whitespace-nowrap'>
                                    {new Date(booking.created_at).toLocaleString()}
                                </div>
                            </td>
                            <td className='py-3 relative px-2'>
                                <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer text-black' onClick={() => openOperation(booking.id)} />
                                <ul className={`${operation && selectedID === booking.id ? 'block' : 'hidden'} absolute bg-white p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-gray-600`}>
                                    {booking.status !== 'canceled' && <button disabled={isLoading} className='flex mb-1 justify-between items-center cursor-dpointer hover:text-red-600' onClick={(e: any) => cancelBookingRequest(e, booking.id)}>
                                        {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : <div className='flex items-center w-full justify-between'>
                                            {tt('cancel')} <FontAwesomeIcon icon={faBan} />
                                        </div>}
                                    </button>}
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-red-600' onClick={() => openDeleteBookingReqeustWarningMOdal(booking)}>{tt('delete')} <FontAwesomeIcon icon={faTrashCan} /></li>
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

export default BookingRequestTable;
