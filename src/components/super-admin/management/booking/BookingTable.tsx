/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faEllipsis, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link'
import { Booking } from '@/lib/types/super-admin/bookingType';
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore';
import useGlobalStore from '@/lib/state/globalStore';
import TruncateTextModal from '@/components/global/TruncateTextModal';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from "@/components/ui/skeleton"
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import { Button } from '@/components/ui/button';
import BookingOperation from './BookingOperation';
import DeleteSingleBookingAlert from './DeleteSingleBookingAlert';

interface Props {

    filteredTable: Booking[]

}

const BookingTable: React.FC<Props> = ({ filteredTable }) => {

    const { operation, skeleton, selectedID, openOperation, closeOperation, isLoading, setIsLoading, returnTruncateText, openTruncateTextModal } = useGlobalStore()

    const { openDeleteBookingWarningMOdal, selectedBookings, setSelectedBookings, cancelBooking } = useAdminBookingStore()
    const t = useTranslations('super-admin')
    const tt = useTranslations('global')
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)


    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);

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
        <div className='w-full flex flex-col'>
            <table className="text-sm text-left shadow-md w-full bg-card border text-muted-foreground">
                <TruncateTextModal />
                <thead className="text-xs uppercase border">
                    <tr>
                        <th scope='col' className='px-2 py-3'>
                            <Checkbox
                                title='Select all 10 rows'
                                checked={isRowChecked}
                                onCheckedChange={selectAllRows}
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
                            <tr className="border hover:bg-muted hover:text-foreground" key={booking.id}>
                                <td className='px-2 py-3'>
                                    <Checkbox
                                        id={booking.id}
                                        onCheckedChange={() => handleSelection(booking)}
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
                                    <div className={`h-5 whitespace-nowrap w-28 ${booking.status === 'cancel-request' && 'text-red-600'}`}>
                                        {booking.status}
                                    </div>
                                </td>
                                <td className="px-2 py-3 overflow-x-auto">
                                    {booking.note &&
                                        <div className={`h-5 w-36 cursor-pointer hover:text-foreground`} onClick={() => openTruncateTextModal(booking.note || 'No Data')}>
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
                                    <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer' onClick={() => openOperation(booking.id)} />
                                    <ul className={`${operation && selectedID === booking.id ? 'block' : 'hidden'} absolute bg-card p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-muted-foreground`}>
                                        {isAdminAllowed('update_booking') && <Link href={`/admin/manage/booking/update/${booking.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground'>{tt('update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>}
                                        {booking.status !== 'canceled' && isAdminAllowed('cancel_booking') && <button disabled={isLoading} className='flex mb-1 justify-between items-center cursor-dpointer hover:text-foreground' onClick={(e: any) => cancelBooking(e, booking.id)}>
                                            {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : <div className='flex items-center w-full justify-between'>
                                                {tt('cancel')} <FontAwesomeIcon icon={faBan} />
                                            </div>}
                                        </button>}
                                        {isAdminAllowed('delete_booking') && <DeleteSingleBookingAlert booking={booking} />}
                                        <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground pt-2 border-t' onClick={() => closeOperation()}>{tt('close')} <FontAwesomeIcon icon={faXmark} /></li>
                                    </ul>
                                </td>
                            </tr>
                        )) :
                        skeleton.map(item => (
                            <tr key={item} className='bg-card border'>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-md w-5 h-5' />
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-36 h-5' />
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-36 h-5' />
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-36 h-5' />
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-36 h-5' />
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-36 h-5' />
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-12 h-5' />
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-16 h-5' />
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-28 h-5' />
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-28 h-5' />
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-32 h-5' />
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-44 h-5' />
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-10 h-5' />
                                </td>
                            </tr>
                        ))
                    }
                </tbody >
            </table>
            <BookingOperation />
        </div>
    );
};

export default BookingTable;
