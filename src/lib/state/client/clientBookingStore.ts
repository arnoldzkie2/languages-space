import { Booking, BookingRequest } from '@/lib/types/super-admin/bookingType'
import axios from 'axios'
import { create } from 'zustand'
import useAdminBookingStore from '../super-admin/bookingStore'
import useGlobalStore from '../globalStore'
import useClientStore from './clientStore'
import useClientCardStore from './clientCardStore'

interface ClientBookingStore {
    bookings: Booking[] | null
    getBookings: () => Promise<void>
    bookingModal: boolean
    requestCancelForm: {
        bookingID: string
        note: string
    },
    setRequestCancelForm: (form: {
        bookingID: string
        note: string
    }) => void
    openBookingModal: () => void
    closeBookingModal: () => void
    createBooking: (e: React.FormEvent, router: any) => Promise<void>
    requestCancelBookingModal: boolean
    cancelBooking: (e: React.FormEvent, bookingID: string) => Promise<void>
    requestCancelBooking: (e: React.FormEvent) => Promise<void>
    openRequestCancelBookingaModal: (bookingID: string) => void
    closeRequestCancelBookingaModal: () => void
    bookingRequests: BookingRequest[] | null
    getBookingRequests: () => Promise<void>
    bookingRequestModal: boolean
    openBookingRequestModal: () => void
    closeBookingRequestModal: () => void
    createBookingRequest: (e: React.FormEvent, router: any) => Promise<void>
    cancelBookingRequest: (e: React.FormEvent, bookingRequestID: string) => Promise<void>
}

const useClientBookingStore = create<ClientBookingStore>((set, get) => ({
    bookings: null,
    getBookings: async () => {

        try {

            const { data } = await axios.get('/api/client/booking')
            if (data.ok) set({ bookings: data.data })

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    },
    bookingModal: false,
    openBookingModal: () => set({ bookingModal: true }),
    closeBookingModal: () => {
        const { setBookingFormData, bookingFormData } = useAdminBookingStore.getState()
        setBookingFormData({ ...bookingFormData, scheduleID: '', meetingInfoID: '', supplierID: '', courseID: '', note: '' })
        set({ bookingModal: false })
    },
    createBooking: async (e: React.FormEvent, router: any) => {

        e.preventDefault()
        const { bookingFormData } = useAdminBookingStore.getState()
        const { setIsLoading, setErr, setOkMsg } = useGlobalStore.getState()
        const { client } = useClientStore.getState()
        const getBookings = useClientBookingStore.getState().getBookings
        const getCards = useClientCardStore.getState().getCards
        const closeBookingModal = get().closeBookingModal
        try {

            const { courseID, supplierID, clientCardID, meetingInfoID, scheduleID, note } = bookingFormData
            if (!courseID) return setErr('Select Course')
            if (!supplierID) return setErr('Select Supplier')
            if (!clientCardID) return setErr('Select Card')
            if (!meetingInfoID) return setErr("Select Meeting Info")
            if (!scheduleID) return setErr('Select Schedule')

            setIsLoading(true)

            const { data } = await axios.post('/api/booking', {
                clientID: client?.id, clientCardID, scheduleID, note,
                courseID, supplierID, meetingInfoID, settlement: '2024-01-20',
                operator: 'client', status: 'confirmed', quantity: 1, name: '1v1 Class'
            })

            if (data.ok) {
                setOkMsg('Success Redirecting...')
                getBookings()
                getCards()
                setTimeout(() => {
                    setIsLoading(false)
                    closeBookingModal()
                    router.push('/client/profile/bookings')
                }, 2000)
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    },
    cancelBooking: async (e: React.FormEvent, bookingID: string) => {

        e.preventDefault()
        const setErr = useGlobalStore.getState().setErr
        const setIsLoading = useGlobalStore.getState().setIsLoading
        const setOkMsg = useGlobalStore.getState().setOkMsg
        const getBookings = get().getBookings

        try {

            setIsLoading(true)
            const { data } = await axios.delete('/api/booking', {
                params: { bookingID, type: 'cancel' }
            })

            if (data.ok) {
                getBookings()
                setIsLoading(false)
                setOkMsg('Success')
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something wentg wrong")
        }
    },
    requestCancelBookingModal: false,
    requestCancelForm: {
        bookingID: '',
        note: ''
    },
    setRequestCancelForm: (form: { bookingID: string, note: string }) => set({ requestCancelForm: form }),
    requestCancelBooking: async (e: React.FormEvent) => {

        e.preventDefault()

        const { setErr, setIsLoading, setOkMsg } = useGlobalStore.getState()
        const { requestCancelForm, getBookings, closeRequestCancelBookingaModal } = get()
        try {
            requestCancelForm.note = requestCancelForm.note.slice(0, 150)
            setIsLoading(true)
            const { data } = await axios.post('/api/client/booking/cancel-request', requestCancelForm)

            if (data.ok) {
                getBookings()
                setIsLoading(false)
                setOkMsg("Request sent successfully!")
                closeRequestCancelBookingaModal()
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
    openRequestCancelBookingaModal: (bookingID: string) => set(s => ({ requestCancelBookingModal: true, requestCancelForm: { ...s.requestCancelForm, bookingID } })),
    closeRequestCancelBookingaModal: () => set({
        requestCancelBookingModal: false, requestCancelForm: {
            bookingID: '',
            note: ''
        }
    }),
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
    bookingRequestModal: false,
    openBookingRequestModal: () => set({ bookingRequestModal: true }),
    closeBookingRequestModal: () => {
        const { setBookingFormData, bookingFormData } = useAdminBookingStore.getState()
        setBookingFormData({ ...bookingFormData, scheduleID: '', meetingInfoID: '', supplierID: '', courseID: '', note: '' })
        set({ bookingRequestModal: false })
    },
    createBookingRequest: async (e: React.FormEvent, data: {
        date: string
        time: string
        router: any
    }) => {

        e.preventDefault()
        const { bookingFormData } = useAdminBookingStore.getState()
        const { setIsLoading, setErr, setOkMsg } = useGlobalStore.getState()
        const { client } = useClientStore.getState()
        const getBookingRequests = useClientBookingStore.getState().getBookingRequests
        const getCards = useClientCardStore.getState().getCards
        const closeBookingModal = get().closeBookingModal
        const { router, time, date } = data
        try {

            const { courseID, supplierID, clientCardID, meetingInfoID, note } = bookingFormData
            if (!courseID) return setErr('Select Course')
            if (!supplierID) return setErr('Select Supplier')
            if (!clientCardID) return setErr('Select Card')
            if (!meetingInfoID) return setErr("Select Meeting Info")

            setIsLoading(true)

            const { data } = await axios.post('/api/booking/request', {
                clientID: client?.id, clientCardID, date, time, note,
                courseID, supplierID, meetingInfoID, settlement: '2024-01-20',
                operator: 'client', status: 'confirmed', quantity: 1, name: '1v1 Class'
            })

            if (data.ok) {
                setOkMsg('Success Redirecting...')
                getBookingRequests()
                getCards()
                setTimeout(() => {
                    setIsLoading(false)
                    closeBookingModal()
                    router.push('/client/profile/booking-requests')
                }, 2000)
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    },
    cancelBookingRequest: async (e: React.FormEvent, bookingRequestID: string) => {

        e.preventDefault()
        const setErr = useGlobalStore.getState().setErr
        const setIsLoading = useGlobalStore.getState().setIsLoading
        const setOkMsg = useGlobalStore.getState().setOkMsg
        const getBookingRequests = get().getBookingRequests

        try {

            setIsLoading(true)
            const { data } = await axios.post('/api/booking/request/cancel', { bookingRequestID })

            if (data.ok) {
                getBookingRequests()
                setIsLoading(false)
                setOkMsg('Success')
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something wentg wrong")
        }
    },
}))

export default useClientBookingStore