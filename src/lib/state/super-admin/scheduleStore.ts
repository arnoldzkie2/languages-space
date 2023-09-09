import { SupplierSchedule } from '@/lib/types/super-admin/scheduleType';
import axios from 'axios';
import { create } from 'zustand'
import useAdminClientStore from './clientStore';


const scheduleDataValue: SupplierSchedule = {
    id: '',
    supplier_id: '',
    client_id: '',
    client_name: '',
    client_card_id: '',
    date: '',
    time: '',
    meeting_info: {
        id: '',
        service: '',
        meeting_code: ''
    },
    note: '',
    completed: false,
    reserved: false
}

export { scheduleDataValue }


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
    openBindSchedule: (schedule: SupplierSchedule) => void
    viewSchedule: boolean
    scheduleData: SupplierSchedule
    openViewSchedule: (scheduleData: SupplierSchedule) => void
    closeViewSchedule: () => void
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
    viewSchedule: false,
    scheduleData: scheduleDataValue,
    openViewSchedule: (schedule: SupplierSchedule) => set({ viewSchedule: true, scheduleData: schedule }),
    closeViewSchedule: () => set({ viewSchedule: false, scheduleData: scheduleDataValue }),
    selectedScheduleID: '',
    openBindSchedule: (schedule: SupplierSchedule) => set({ selectedScheduleID: schedule.id, bindSchedule: true }),
    closeBindSchedule: () => {

        const { setClientSelectedID } = useAdminClientStore.getState()

        setClientSelectedID('')
        
        set({ selectedScheduleID: '', bindSchedule: false })
    }
}))

export default useAdminScheduleStore