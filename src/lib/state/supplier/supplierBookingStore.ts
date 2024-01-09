import { Booking } from '@/lib/types/super-admin/bookingType'
import axios from 'axios'
import { create } from 'zustand'

interface SupplerBookingStore {
    getBookings: () => Promise<void>
    viewBooking: (ID: string) => void
    closeBooking: () => void
    bookingID: string
    bookingModal: boolean
    bookings: Booking[] | null
}

const useSupplierBookingStore = create<SupplerBookingStore>((set) => ({
    bookings: null,
    bookingModal: false,
    bookingID: '',
    closeBooking: () => set({ bookingID: '', bookingModal: false }),
    viewBooking: (ID: string) => set({ bookingModal: true, bookingID: ID }),
    getBookings: async () => {
        try {

            const { data } = await axios.get('/api/supplier/booking')

            if (data.ok) set({ bookings: data.data })

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    },
}))

export default useSupplierBookingStore