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
    getBookings: () => Promise<void>
    totalBooking: TotalProps
    setTotalBooking: (total: TotalProps) => void
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
    totalBooking: totalBookingValue,
    setTotalBooking: (total: TotalProps) => set({ totalBooking: total })
}))

export default useAdminBookingStore