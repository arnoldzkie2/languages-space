import { Booking, BookingRequest } from '@/lib/types/super-admin/bookingType'
import axios from 'axios'
import { create } from 'zustand'
import useGlobalStore from '../globalStore'
import useAdminScheduleStore from '../super-admin/scheduleStore'
import useSupplierStore from './supplierStore'
import useClientBookingStore from '../client/clientBookingStore'
import { toast } from 'sonner'

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
    bookingRequests: BookingRequest[] | null
    getBookingRequests: () => Promise<void>
    cancelBookingRequest: (e: React.FormEvent, bookingRequestID: string) => Promise<void>
    confirmBookingRequest: (e: React.MouseEvent, bookingRequestID: string) => Promise<void>
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
                getSchedule(supplier?.id!, currentDate.fromDate, currentDate.toDate)
                setIsLoading(false)
                toast('Success! Booking canceled')
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
        const { setErr, setIsLoading } = useGlobalStore.getState()
        const { getBookings, getSingleBooking } = get()
        try {
            setIsLoading(true)
            const { data } = await axios.post('/api/supplier/booking/cancel-request', requestCancelForm)

            if (data.ok) {
                getBookings()
                getSingleBooking()
                setIsLoading(false)
                toast("Success! cancel request sent.")
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
    },
    bookingRequests: null,
    getBookingRequests: async () => {
        try {
            const { data } = await axios.get('/api/booking/request')
            if (data.ok) set({ bookingRequests: data.data })
        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    },
    cancelBookingRequest: async (e: React.FormEvent, bookingRequestID: string) => {

        e.preventDefault()
        const setErr = useGlobalStore.getState().setErr
        const setIsLoading = useGlobalStore.getState().setIsLoading
        const getBookingRequests = get().getBookingRequests

        try {

            setIsLoading(true)
            const { data } = await axios.post('/api/booking/request/cancel', { bookingRequestID })

            if (data.ok) {
                getBookingRequests()
                setIsLoading(false)
                toast('Success! booking request canceled.')
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    },
    confirmBookingRequest: async (e: React.MouseEvent, bookingRequestID: string) => {
        e.preventDefault()
        const setErr = useGlobalStore.getState().setErr
        const setIsLoading = useGlobalStore.getState().setIsLoading
        const { getBookingRequests, getBookings } = get()

        try {

            setIsLoading(true)
            const { data } = await axios.post('/api/booking/request/confirm', { bookingRequestID })

            if (data.ok) {
                toast('Success! booking request confirmed')
                getBookingRequests()
                getBookings()
                setIsLoading(false)
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    }
}))

export default useSupplierBookingStore