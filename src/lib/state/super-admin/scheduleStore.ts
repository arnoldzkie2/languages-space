import { SupplierSchedule } from '@/lib/types/super-admin/scheduleType';
import axios from 'axios';
import { create } from 'zustand'
import useAdminClientStore from './clientStore';
import { Booking } from '@/lib/types/super-admin/bookingType';

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
    selectedScheduleID: string
    closeBindSchedule: () => void
    bookingID: string
    openViewBooking: (booking: string) => void
    openBindSchedule: (schedule: SupplierSchedule) => void
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
    bookingID: 'null',
    openViewBooking: (bookingID: string) => set({ viewBooking: true, bookingID: bookingID }),
    closeViewBooking: () => set({ viewBooking: false, bookingID: 'null' }),
    selectedScheduleID: '',
    openBindSchedule: (schedule: SupplierSchedule) => set({ selectedScheduleID: schedule.id, bindSchedule: true }),
    closeBindSchedule: () => {
        const { setClientSelectedID } = useAdminClientStore.getState()
        setClientSelectedID('')
        set({ selectedScheduleID: '', bindSchedule: false })
    }
}))

export default useAdminScheduleStore