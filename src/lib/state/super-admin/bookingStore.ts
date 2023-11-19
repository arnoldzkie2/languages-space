import { Booking } from '@/lib/types/super-admin/bookingType'
import axios from 'axios'
import { create } from 'zustand'
import useAdminGlobalStore from './globalStore'
import { TotalProps } from '@/lib/types/super-admin/globalType'

const totalBookingValue = {
    searched: '',
    selected: '',
    total: ''
}


interface BookingProps {

    bookings: Booking[]
    selectedBookings: Booking[]
    getBookings: () => Promise<void>
    totalBooking: TotalProps
    bookingData: Booking | null
    deleteBooking: boolean
    setTotalBooking: (total: TotalProps) => void
    setSelectedBookings: (bookings: Booking[]) => void
    openDeleteWarningModal: (booking: Booking) => void
    closeDeleteWarningModal: () => void
}

const useAdminBookingStore = create<BookingProps>((set) => ({
    bookings: [],
    getBookings: async () => {

        const { departmentID } = useAdminGlobalStore.getState()
        try {

            const { data } = await axios.get(`/api/booking${departmentID && `?departmentID=${departmentID}`}`)
            if (data.ok) {
                set({ bookings: data.data })
            }

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    bookingData: null,
    deleteBooking: false,
    openDeleteWarningModal: (booking: Booking) => set({ deleteBooking: true, bookingData: booking }),
    closeDeleteWarningModal: () => set({ deleteBooking: false, bookingData: null }),
    selectedBookings: [],
    setSelectedBookings: (bookings: Booking[]) => set({ selectedBookings: bookings }),
    totalBooking: totalBookingValue,
    setTotalBooking: (total: TotalProps) => set({ totalBooking: total })
}))

export default useAdminBookingStore