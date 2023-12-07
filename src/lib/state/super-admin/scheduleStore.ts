import { SupplierSchedule } from '@/lib/types/super-admin/scheduleType';
import axios from 'axios';
import { create } from 'zustand'
import useAdminClientStore from './clientStore';
import { Booking } from '@/lib/types/super-admin/bookingType';
import useAdminBookingStore from './bookingStore';

interface ScheduleProps {
    schedules: SupplierSchedule[]
    newSchedule: boolean
    toggleSchedule: () => void
    currentDate: {
        fromDate: string
        toDate: string
    }
    setCurrentDate: (date: {
        fromDate: string;
        toDate: string;
    }) => void
    getSchedule: (supplierID: string, fromDate: string, toDate: string) => Promise<void>
    bindSchedule: boolean
    closeBindSchedule: () => void
    bookingID: string | null
    openViewBooking: (booking: string) => void
    openBindSchedule: (scheduleID: string) => void
    closeViewBooking: () => void
    viewBooking: boolean
}

const useAdminScheduleStore = create<ScheduleProps>((set) => ({
    currentDate: {
        fromDate: '',
        toDate: ''
    },
    setCurrentDate: (date: { fromDate: string, toDate: string }) => set({ currentDate: date }),
    schedules: [],
    getSchedule: async (supplierID: string, fromDate: string, toDate: string) => {
        try {
            const { data } = await axios.get(`/api/schedule/date`, {
                params: {
                    supplierID, fromDate, toDate
                }
            })
            if (data.ok) set({ schedules: data.data })

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    newSchedule: false,
    toggleSchedule: () => set(state => ({ newSchedule: !state.newSchedule })),
    bindSchedule: false,
    viewBooking: false,
    bookingID: null,
    openViewBooking: (bookingID: string) => set({ viewBooking: true, bookingID }),
    closeViewBooking: () => set({ viewBooking: false, bookingID: null }),
    openBindSchedule: (scheduleID: string) => {

        const { setBookingFormData, bookingFormData } = useAdminBookingStore.getState()

        setBookingFormData({ ...bookingFormData, scheduleID })
        set({ bindSchedule: true })
    },
    closeBindSchedule: () => {
        set({ bindSchedule: false })
    }
}))

export default useAdminScheduleStore