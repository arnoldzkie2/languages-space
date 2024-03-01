/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faEllipsis, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import { BookingRequest } from '@/lib/types/super-admin/bookingType';
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore';
import axios from 'axios';
import useGlobalStore from '@/lib/state/globalStore';
import TruncateTextModal from '@/components/global/TruncateTextModal';
import { Skeleton } from '@/components/ui/skeleton';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import DeleteSingleBookingRequestAlert from './DeleteSingleBookingRequestAlert';
import DeleteSelectedBookingRequestAlert from './DeleteSelectedBookingRequestAlert';

interface Props {
    filteredTable: BookingRequest[]
}

const BookingRequestTable: React.FC<Props> = ({ filteredTable }) => {

    const { operation, skeleton, selectedID, openOperation, closeOperation, isLoading, setIsLoading, returnTruncateText, openTruncateTextModal } = useGlobalStore()

    const { getBookingRequests, selectedBookingRequests, setSelectedBookingRequests } = useAdminBookingStore()
    const t = useTranslations()
    const isAdinAllowed = useAdminPageStore(s => s.isAdminAllowed)
    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);

    const cancelBookingRequest = async (e: React.MouseEvent, bookingRequestID: string) => {

        e.preventDefault()
        try {

            setIsLoading(true)
            const { data } = await axios.post('/api/booking/request/cancel', {
                bookingRequestID
            })

            if (data.ok) {
                setIsLoading(false)
                toast("Success! Booking reuqest canceled.")
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
        <div className='flex flex-col w-full'>
            <table className="text-sm text-left text-muted-foreground shadow-md w-full">
                <TruncateTextModal />
                <thead className="text-xs uppercase bg-card border">
                    <tr>
                        <th scope='col' className='px-2 py-3'>
                            <Checkbox
                                className='cursor-pointer w-3.5 h-3.5 outline-none'
                                title='Select all 10 rows'
                                checked={isRowChecked}
                                onCheckedChange={selectAllRows}
                            />
                        </th>
                        <th scope="col" className="px-2 py-3">{t('info.name')}</th>
                        <th scope="col" className="px-2 py-3">{t('user.client')}</th>
                        <th scope="col" className="px-2 py-3">{t('user.supplier')}</th>
                        <th scope="col" className="px-2 py-3">{t('card.h1')}</th>
                        <th scope="col" className="px-2 py-3">{t('schedule.h1')}</th>
                        <th scope="col" className="px-2 py-3">{t('info.operator.h1')}</th>
                        <th scope="col" className="px-2 py-3">{t('status.h1')}</th>
                        <th scope="col" className="px-2 py-3">{t('info.note')}</th>
                        <th scope="col" className="px-2 py-3">{t('info.date.h1')}</th>
                        <th scope="col" className="px-2 py-3">{t('operation.h1')}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTable && filteredTable.length > 0 ?
                        filteredTable.map(booking => (
                            <tr className="bg-card border hover:bg-muted" key={booking.id}>
                                <td className='px-2 py-3'>
                                    <Checkbox id={booking.id}
                                        className='cursor-pointer w-3.5 h-3.5 outline-none'
                                        onCheckedChange={() => handleSelection(booking)}
                                        checked={selectedBookingRequests.some(selectedBooking => selectedBooking.id === booking.id)}
                                    />
                                </td>
                                <td className='px-2 overflow-x-auto py-3'>
                                    <div className='h-5 w-36 cursor-pointer' onClick={() => openTruncateTextModal(booking.name)}>
                                        {returnTruncateText(booking.name, 15)}
                                    </div>
                                </td>
                                <td className='px-2 overflow-x-auto py-3'>
                                    <div className='h-5 w-36 cursor-pointer' onClick={() => openTruncateTextModal(booking.client.username)}>
                                        {returnTruncateText(booking.client.username, 15)}
                                    </div>
                                </td>
                                <td className='px-2 overflow-x-auto py-3'>
                                    <div className='h-5 w-36 cursor-pointer' onClick={() => openTruncateTextModal(booking.supplier.name)}>
                                        {returnTruncateText(booking.supplier.name, 15)}
                                    </div>
                                </td>
                                <td className='px-2 overflow-x-auto py-3'>
                                    <div className='h-5 w-36 cursor-pointer' onClick={() => openTruncateTextModal(booking.card_name)}>
                                        {returnTruncateText(booking.card_name, 15)}
                                    </div>
                                </td>
                                <td className='px-2 overflow-x-auto py-3'>
                                    <div className='h-5 w-36 cursor-pointer' onClick={() => openTruncateTextModal(`${booking.date} ${booking.time}`)}>
                                        {booking.date} ({booking.time})
                                    </div>
                                </td>
                                <td className="px-2 overflow-x-auto py-3">
                                    <div className='h-5 w-28'>
                                        {booking.operator}
                                    </div>
                                </td>
                                <td className="px-2 overflow-x-auto py-3">
                                    <div className='h-5 w-28'>
                                        {booking.status}
                                    </div>
                                </td>
                                <td className="px-2 py-3 overflow-x-auto">
                                    {booking.note &&
                                        <div className={`h-5 w-36 cursor-pointer hover:text-primary`} onClick={() => openTruncateTextModal(booking.note || 'No Data')}>
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
                                        {booking.status !== 'canceled' && booking.status !== 'confirmed' && isAdinAllowed('cancel_booking_request') && <button disabled={isLoading} className='flex mb-1 justify-between items-center cursor-dpointer hover:text-foreground' onClick={(e) => cancelBookingRequest(e, booking.id)}>
                                            {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : <div className='flex items-center w-full justify-between'>
                                                {t('operation.cancel')} <FontAwesomeIcon icon={faBan} />
                                            </div>}
                                        </button>}
                                        {isAdinAllowed('delete_booking_request') && <DeleteSingleBookingRequestAlert bookingRequest={booking} />}
                                        <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground pt-2 border-t' onClick={() => closeOperation()}>{t('operation.close')} <FontAwesomeIcon icon={faXmark} /></li>
                                    </ul>
                                </td>
                            </tr>
                        )) :
                        skeleton.map(item => (
                            <tr key={item} className='border bg-card'>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-md w-5 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-28 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-28 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-32 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-44 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-2'>
                                    <Skeleton className='rounded-3xl w-10 h-5'></Skeleton>
                                </td>
                            </tr>
                        ))
                    }
                </tbody >
            </table >
            <DeleteSelectedBookingRequestAlert />
        </div>
    );
};

export default BookingRequestTable;
