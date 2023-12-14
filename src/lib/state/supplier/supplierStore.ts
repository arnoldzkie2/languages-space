import { Booking } from '@/lib/types/super-admin/bookingType'
import { SupplierSchedule } from '@/lib/types/super-admin/scheduleType'
import { SupplierMeetingInfo } from '@/lib/types/super-admin/supplierTypes'
import axios from 'axios'
import { Session } from 'next-auth'
import { create } from 'zustand'

interface Props {
    supplier: Session['user'] | null
    setSupplier: (data: Session['user']) => void
    bookings: Booking[] | null
    meetingInfo: SupplierMeetingInfo[] | null
    getSupplierMeeting: () => Promise<void>
    getSupplierBookings: () => Promise<void>
    setSupplierMeeting: (data: SupplierMeetingInfo[]) => void
}

const useSupplierStore = create<Props>((set, get) => ({
    supplier: null,
    meetingInfo: null,
    getSupplierMeeting: async () => {
        try {
            const { supplier } = get()

            const { data } = await axios.get('/api/supplier/meeting', { params: { supplierID: supplier?.id } })
            if (data.ok) set({ meetingInfo: data.data })

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert('Something weng wrong')
        }
    },
    setSupplierMeeting: (data: SupplierMeetingInfo[]) => set({ meetingInfo: data }),
    setSupplier: (data: Session['user']) => set({ supplier: data }),
    bookings: null,
    getSupplierBookings: async () => {

        const { supplier } = get()

        try {

            const { data } = await axios.get('/api/supplier/booking', { params: { supplierID: supplier?.id } })

            if (data.ok) set({ bookings: data.data })

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }
}))

export default useSupplierStore