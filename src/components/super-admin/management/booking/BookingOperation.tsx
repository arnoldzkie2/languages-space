import useAdminBookingStore from '@/lib/state/super-admin/bookingStore'
import React from 'react'
import CreateOrder from './CreateOrder'
import DeleteSelectedBookings from './DeleteSelectedBookings'
import MarkBookingAsCompleted from './MarkBookingAsCompleted'

const BookingOperation = () => {

    const { selectedBookings } = useAdminBookingStore()

    if (selectedBookings.length === 0) return null
    return (
        <div className='flex w-full items-center gap-5 bg-card border p-3'>
            <DeleteSelectedBookings />
            <MarkBookingAsCompleted />
            <CreateOrder />
        </div>
    )
}

export default BookingOperation