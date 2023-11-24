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
    selectedReminders: Booking[]
    reminders: Booking[]
    getReminders: () => Promise<void>
    getBookings: () => Promise<void>
    totalBooking: TotalProps
    totalReminders: TotalProps
    bookingData: Booking | null
    remindersData: Booking | null
    deleteBooking: boolean
    deleteReminders: boolean
    setTotalBooking: (total: TotalProps) => void
    setTotalReminders: (total: TotalProps) => void
    setSelectedReminders: (bookings: Booking[]) => void
    setSelectedBookings: (bookings: Booking[]) => void
    openDeleteBookingWarningMOdal: (booking: Booking) => void
    openDeleteRemindersWarningMOdal: (booking: Booking) => void
    closeDeleteBookingWarningModal: () => void
    closeDeleteRemindersWarningModal: () => void
}

const useAdminBookingStore = create<BookingProps>((set) => ({
    bookings: [],
    reminders: [],
    selectedReminders: [],
    totalReminders: totalBookingValue,
    getReminders: async () => {
        try {
            const { departmentID } = useAdminGlobalStore.getState()
            const { data } = await axios.get(`/api/booking/reminders${departmentID && `?departmentID=${departmentID}`}`)

            if (data.ok) set({ reminders: data.data })

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    getBookings: async () => {
        try {

            const { departmentID } = useAdminGlobalStore.getState()
            const { data } = await axios.get(`/api/booking${departmentID && `?departmentID=${departmentID}`}`)

            if (data.ok) set({ bookings: data.data })

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    bookingData: null,
    remindersData: null,
    deleteBooking: false,
    deleteReminders: false,
    confirmBooking: false,
    openDeleteBookingWarningMOdal: (booking: Booking) => set({ deleteBooking: true, bookingData: booking }),
    openDeleteRemindersWarningMOdal: (booking: Booking) => set({ deleteReminders: true, remindersData: booking }),
    closeDeleteBookingWarningModal: () => set({ deleteBooking: false, bookingData: null }),
    closeDeleteRemindersWarningModal: () => set({ deleteReminders: false, remindersData: null }),
    selectedBookings: [],
    setSelectedReminders: (bookings: Booking[]) => set({ selectedReminders: bookings }),
    setSelectedBookings: (bookings: Booking[]) => set({ selectedBookings: bookings }),
    totalBooking: totalBookingValue,
    setTotalBooking: (total: TotalProps) => set({ totalBooking: total }),
    setTotalReminders: (total: TotalProps) => set({ totalBooking: total })
}))

export default useAdminBookingStore