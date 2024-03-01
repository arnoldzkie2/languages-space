/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faEllipsis, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link'
import { BookingProps } from '@/lib/types/super-admin/bookingType';
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore';
import useGlobalStore from '@/lib/state/globalStore';
import TruncateTextModal from '@/components/global/TruncateTextModal';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from "@/components/ui/skeleton"
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import BookingOperation from './BookingOperation';
import DeleteSingleBookingAlert from './DeleteSingleBookingAlert';
import ViewBookingAlert from './ViewBookingAlert';
import ViewClientCommentAlert from '@/components/client/ViewClientCommentAlert';
import { Separator } from '@/components/ui/separator';
import ViewSupplierCommentAlert from '@/components/supplier/ViewSupplierBookingComment';
import ViewCommentsAlert from './ViewCommentsAlert';

interface Props {

    filteredTable: BookingProps[]

}

const BookingTable: React.FC<Props> = ({ filteredTable }) => {

    const { operation, skeleton, selectedID, openOperation, closeOperation, isLoading, setIsLoading, returnTruncateText, openTruncateTextModal } = useGlobalStore()

    const { selectedBookings, setSelectedBookings, cancelBooking } = useAdminBookingStore()
    const t = useTranslations()
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)


    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);

    const handleSelection = (booking: BookingProps) => {

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

        let updatedSelectedBooking: BookingProps[];

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
                        <th scope="col" className="px-2 py-3">{t('info.name')}</th>
                        <th scope="col" className="px-2 py-3">{t('side_nav.client')}</th>
                        <th scope="col" className="px-2 py-3">{t('side_nav.supplier')}</th>
                        <th scope="col" className="px-2 py-3">{t('card.h1')}</th>
                        <th scope="col" className="px-2 py-3">{t('schedule.h1')}</th>
                        <th scope="col" className="px-2 py-3">{t('info.quantity')}</th>
                        <th scope="col" className="px-2 py-3">{t('card.price')}</th>
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
                            <tr className="border hover:bg-muted hover:text-foreground" key={booking.id}>
                                <td className='px-2 py-3'>
                                    <Checkbox
                                        id={booking.id}
                                        onCheckedChange={() => handleSelection(booking)}
                                        checked={selectedBookings.some(selectedBooking => selectedBooking.id === booking.id)}
                                    />
                                </td>
                                <td className='px-2 py-3'>
                                    <div className='h-5 w-28 cursor-pointer' onClick={() => openTruncateTextModal(booking.name)}>
                                        {returnTruncateText(booking.name, 10)}
                                    </div>
                                </td>
                                <td className='px-2 py-3'>
                                    <div className='h-5 w-28 cursor-pointer' onClick={() => openTruncateTextModal(booking.client.username)}>
                                        {returnTruncateText(booking.client.username, 10)}
                                    </div>
                                </td>
                                <td className='px-2 py-3'>
                                    <div className='h-5 w-28 cursor-pointer' onClick={() => openTruncateTextModal(booking.supplier.name)}>
                                        {returnTruncateText(booking.supplier.name, 10)}
                                    </div>
                                </td>
                                <td className='px-2 py-3'>
                                    <div className='h-5 w-28 cursor-pointer' onClick={() => openTruncateTextModal(booking.card_name)}>
                                        {returnTruncateText(booking.card_name, 10)}
                                    </div>
                                </td>
                                <td className='px-2 py-3'>
                                    <div className='h-5 w-28 cursor-pointer' onClick={() => openTruncateTextModal(`${booking.schedule.date} (${booking.schedule.time})`)}>
                                        {returnTruncateText(`${booking.schedule.date} ${booking.schedule.time}`, 10)}
                                    </div>
                                </td>
                                <td className="px-2 py-3">
                                    <div className='h-5 w-20'>
                                        <select className='bg-card border outline-none p-1 w-full'>
                                            <option disabled>{t("info.quantity")}</option>
                                            <option value={Number(booking.client_quantity)}>{t("user.client")}: {Number(booking.client_quantity)}</option>
                                            <option value={Number(booking.supplier_quantity)}>{t("user.supplier")}: {Number(booking.supplier_quantity)}</option>
                                        </select>
                                    </div>
                                </td>
                                <td className="px-2 py-3">
                                    <div className='h-5 w-28 cursor-pointer'>
                                        {returnTruncateText(String(booking.price), 10)}
                                    </div>
                                </td>
                                <td className="px-2 py-3">
                                    <div className='h-5 w-28 cursor-pointer'>
                                        {returnTruncateText(booking.operator, 10)}
                                    </div>
                                </td>
                                <td className="px-2 py-3">
                                    <div className={`h-5 w-28 cursor-pointer ${booking.status === 'cancel-request' && 'text-red-600'}`}>
                                        {returnTruncateText(booking.status, 10)}
                                    </div>
                                </td>
                                <td className="px-2 py-3">
                                    {booking.note &&
                                        <div className={`h-5 w-28 cursor-pointer hover:text-foreground`} onClick={() => openTruncateTextModal(booking.note || 'No Data')}>
                                            {returnTruncateText(booking.note || '', 10)}
                                        </div>
                                    }
                                </td>
                                <td className="px-2 py-3">
                                    <div className='h-5 w-28 cursor-pointer'>
                                        {returnTruncateText(new Date(booking.created_at).toLocaleString(), 10)}
                                    </div>
                                </td>
                                <td className='py-3 relative px-2'>
                                    <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer' onClick={() => openOperation(booking.id)} />
                                    <ul className={`${operation && selectedID === booking.id ? 'block' : 'hidden'} absolute bg-card p-3 gap-1 z-10 w-32 left-0 shadow-lg border flex flex-col text-muted-foreground`}>
                                        <ViewCommentsAlert booking={booking} />
                                        <ViewBookingAlert booking={booking} />
                                        {isAdminAllowed('update_booking') && <Link href={`/admin/manage/booking/update/${booking.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground'>{t('operation.update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>}
                                        {booking.status !== 'canceled' && isAdminAllowed('cancel_booking') && <button disabled={isLoading} className='flex mb-1 justify-between items-center cursor-dpointer hover:text-foreground' onClick={(e: any) => cancelBooking(e, booking.id)}>
                                            {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : <div className='flex items-center w-full justify-between'>
                                                {t('operation.cancel')} <FontAwesomeIcon icon={faBan} />
                                            </div>}
                                        </button>}
                                        {isAdminAllowed('delete_booking') && <DeleteSingleBookingAlert booking={booking} />}
                                        <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground pt-2 border-t' onClick={() => closeOperation()}>{t('operation.close')} <FontAwesomeIcon icon={faXmark} /></li>
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
