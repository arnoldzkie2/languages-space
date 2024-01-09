import { Booking } from '@/lib/types/super-admin/bookingType'
import axios from 'axios'
import { create } from 'zustand'
import useGlobalStore from '../globalStore'
import useAdminScheduleStore from '../super-admin/scheduleStore'
import useSupplierStore from './supplierStore'
import useClientBookingStore from '../client/clientBookingStore'

interface SupplerBookingStore {
    getBookings: () => Promise<void>
    viewBooking: (ID: string) => void
    closeBooking: () => void
    bookingID: string
    bookingModal: boolean
    bookings: Booking[] | null
    singleBooking: Booking | null
    getSingleBooking: () => Promise<void>
    cancelBooking: (e: React.MouseEvent) => Promise<void>
    requestCancelBooking: (e: React.FormEvent) => Promise<void>
}

const useSupplierBookingStore = create<SupplerBookingStore>((set, get) => ({
    bookings: null,
    bookingModal: false,
    bookingID: '',
    singleBooking: null,
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
    getSingleBooking: async () => {

        const bookingID = get().bookingID

        try {

            const { data } = await axios.get('/api/supplier/booking', { params: { bookingID } })
            if (data.ok) set({ singleBooking: data.data })

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    },
    cancelBooking: async (e: React.MouseEvent) => {
        e.preventDefault()
        const setErr = useGlobalStore.getState().setErr
        const setIsLoading = useGlobalStore.getState().setIsLoading
        const setOkMsg = useGlobalStore.getState().setOkMsg
        const { bookingID, closeBooking } = get()
        const { currentDate, getSchedule } = useAdminScheduleStore.getState()
        const supplier = useSupplierStore.getState().supplier
        try {

            setIsLoading(true)
            const { data } = await axios.delete('/api/booking', {
                params: {
                    bookingID,
                    type: 'cancel'
                }
            })

            if (data.ok) {
                axios.post('/api/email/booking/cancel', { bookingID: data.data, operator: 'supplier' })
                getSchedule(supplier?.id!, currentDate.fromDate, currentDate.toDate)
                setIsLoading(false)
                setOkMsg('Booking Canceled')
                closeBooking()
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error)
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    },
    requestCancelBooking: async (e: React.FormEvent) => {
        e.preventDefault()
        const { closeRequestCancelBookingaModal, requestCancelForm } = useClientBookingStore.getState()
        const { setErr, setOkMsg, setIsLoading } = useGlobalStore.getState()
        const { getBookings, getSingleBooking } = get()
        try {
            setIsLoading(true)
            const { data } = await axios.post('/api/supplier/booking/cancel-request', requestCancelForm)

            if (data.ok) {
                getBookings()
                getSingleBooking()
                setIsLoading(false)
                setOkMsg("Success")
                closeRequestCancelBookingaModal()
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    }
}))

export default useSupplierBookingStore