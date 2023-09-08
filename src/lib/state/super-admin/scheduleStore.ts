import { SupplierSchedule } from '@/lib/types/super-admin/scheduleType';
import axios from 'axios';
import { create } from 'zustand'

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
    toggleSchedule: () => set(state => ({ newSchedule: !state.newSchedule }))
}))

export default useAdminScheduleStore