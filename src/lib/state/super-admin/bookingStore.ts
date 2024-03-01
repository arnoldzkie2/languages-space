import { BookingProps, BookingRequest } from '@/lib/types/super-admin/bookingType'
import axios from 'axios'
import { create } from 'zustand'
import useGlobalStore from '../globalStore'
import { TotalProps } from '@/lib/types/super-admin/globalType'
import { toast } from 'sonner'
import useDepartmentStore from './departmentStore'
import { ADMIN } from '@/utils/constants'

const totalBookingValue = {
    searched: '',
    selected: '',
    total: ''
}

const bookingFormDataValue: BookingFormData = {
    name: '',
    note: '',
    scheduleID: '',
    status: 'confirmed',
    supplierID: '',
    settlement: '',
    client_quantity: 1,
    departmentID: '',
    supplier_quantity: 1,
    clientID: '',
    clientCardID: '',
    meetingInfoID: '',
    courseID: '',
}

export { bookingFormDataValue }

interface BookingFormData {
    name: string
    note: string
    scheduleID: string
    status: string
    client_quantity: number
    supplier_quantity: number
    departmentID: string
    supplierID: string
    settlement: string
    clientID: string
    clientCardID: string
    meetingInfoID: string
    courseID: string
}

export type { BookingFormData }

interface BookingStoreProps {
    bookingFormData: BookingFormData
    setBookingFormData: (data: BookingFormData) => void
    bookings: BookingProps[]
    selectedBookings: BookingProps[]
    selectedReminders: BookingProps[]
    reminders: BookingProps[]
    getReminders: () => Promise<void>
    getBookings: () => Promise<void>
    totalBooking: TotalProps
    totalReminders: TotalProps
    bookingData: BookingProps | null
    remindersData: BookingProps | null
    deleteBooking: boolean
    deleteReminders: boolean
    setTotalBooking: (total: TotalProps) => void
    setTotalReminders: (total: TotalProps) => void
    setSelectedReminders: (bookings: BookingProps[]) => void
    setSelectedBookings: (bookings: BookingProps[]) => void
    openDeleteBookingWarningMOdal: (booking: BookingProps) => void
    openDeleteRemindersWarningMOdal: (booking: BookingProps) => void
    closeDeleteBookingWarningModal: () => void
    closeDeleteRemindersWarningModal: () => void
    bookingRequests: BookingRequest[]
    getBookingRequests: () => Promise<void>
    selectedBookingRequests: BookingRequest[]
    setSelectedBookingRequests: (bookingRequsts: BookingRequest[]) => void
    deleteBookingRequestModal: boolean
    bookingRequestData: BookingRequest | null
    openDeleteBookingReqeustWarningMOdal: (data: BookingRequest) => void
    closeDeleteBookingRequestWarningModal: () => void
    cancelBooking: (e: React.MouseEvent, bookingID: string) => Promise<void>
    updateBooking: (e: React.FormEvent, bookingID: string, router: any) => Promise<void>
    createBookingRequest: (e: React.FormEvent, data: {
        date: string;
        time: string;
        router: any;
    }) => Promise<void>
    createBooking: (e: React.FormEvent, router: any) => Promise<void>
    createBookingOrder: (e: React.FormEvent, setOpen: React.Dispatch<React.SetStateAction<boolean>>
    ) => Promise<void>
    markBookingAsCompleted: (e: React.FormEvent, setOpen: React.Dispatch<React.SetStateAction<boolean>>) => Promise<void>
}

const useAdminBookingStore = create<BookingStoreProps>((set, get) => ({
    bookingFormData: bookingFormDataValue,
    setBookingFormData: (data: BookingFormData) => set({ bookingFormData: data }),
    bookings: [],
    reminders: [],
    selectedReminders: [],
    totalReminders: totalBookingValue,
    getReminders: async () => {
        try {
            const { departmentID } = useDepartmentStore.getState()
            const { data } = await axios.get(`/api/booking/reminders${departmentID && `?departmentID=${departmentID}`}`)

            if (data.ok) set({ reminders: data.data })

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    getBookings: async () => {
        try {

            const { departmentID } = useDepartmentStore.getState()
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
    openDeleteBookingWarningMOdal: (booking) => set({ deleteBooking: true, bookingData: booking }),
    openDeleteRemindersWarningMOdal: (booking) => set({ deleteReminders: true, remindersData: booking }),
    closeDeleteBookingWarningModal: () => set({ deleteBooking: false, bookingData: null }),
    closeDeleteRemindersWarningModal: () => set({ deleteReminders: false, remindersData: null }),
    selectedBookings: [],
    setSelectedReminders: (bookings) => set({ selectedReminders: bookings }),
    setSelectedBookings: (bookings) => set({ selectedBookings: bookings }),
    totalBooking: totalBookingValue,
    setTotalBooking: (total: TotalProps) => set({ totalBooking: total }),
    setTotalReminders: (total: TotalProps) => set({ totalReminders: total }),
    bookingRequests: [],
    getBookingRequests: async () => {
        try {

            const { departmentID } = useDepartmentStore.getState()
            const { data } = await axios.get(`/api/booking/request${departmentID && `?departmentID=${departmentID}`}`)

            if (data.ok) set({ bookingRequests: data.data })

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    selectedBookingRequests: [],
    setSelectedBookingRequests: (bookingRequsts) => set({ selectedBookingRequests: bookingRequsts }),
    deleteBookingRequestModal: false,
    bookingRequestData: null,
    openDeleteBookingReqeustWarningMOdal: (data) => set({ deleteBookingRequestModal: true, bookingRequestData: data }),
    closeDeleteBookingRequestWarningModal: () => set({ deleteBookingRequestModal: false, bookingRequestData: null }),
    cancelBooking: async (e, bookingID) => {

        const { setIsLoading, setErr } = useGlobalStore.getState()
        const getBookings = get().getBookings
        e.preventDefault()
        try {

            setIsLoading(true)
            const { data } = await axios.delete('/api/booking', {
                params: { bookingID, type: 'cancel' }
            })

            if (data.ok) {
                setIsLoading(false)
                toast("Success! booking has been canceled.")
                getBookings()
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
    createBooking: async (e: React.FormEvent, router: any) => {

        e.preventDefault()
        const bookingFormData = get().bookingFormData
        const { setErr, setIsLoading } = useGlobalStore.getState()
        const departmentID = useDepartmentStore.getState().departmentID
        try {

            const { clientCardID, clientID, meetingInfoID, supplierID, scheduleID, note, courseID, name, status, client_quantity, supplier_quantity, settlement } = bookingFormData

            if (!name) return setErr('Write Name for this booking')
            if (!clientID) return setErr('Select Client')
            if (!clientCardID) return setErr('Select Card')
            if (!meetingInfoID) return setErr('Select Meeting Info')
            if (!supplierID) return setErr('Select Supplier')
            if (!scheduleID) return setErr('Select Schedule')
            if (!courseID) return setErr('Select Course')
            if (!departmentID) return setErr("Select Department!")

            setIsLoading(true)
            const { data } = await axios.post('/api/booking', {
                note, clientCardID, clientID, meetingInfoID, settlement,
                supplierID, scheduleID, courseID,
                client_quantity: Number(client_quantity),
                supplier_quantity: Number(supplier_quantity),
                name, status
            })

            if (data.ok) {
                setErr('')
                setIsLoading(false)
                toast('Success! Booking has been created', {
                })
                router.push('/admin/manage/booking')
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
    updateBooking: async (e: React.FormEvent, bookingID: string, router: any) => {

        const { setErr, setIsLoading } = useGlobalStore.getState()
        const bookingFormData = get().bookingFormData
        e.preventDefault()

        try {

            const { clientCardID, clientID, status, meetingInfoID, supplierID, scheduleID, note, courseID, name, client_quantity, supplier_quantity, settlement, departmentID } = bookingFormData
            if (!name) return setErr('Write Name for this booking')
            if (!clientID) return setErr('Select Client')
            if (!clientCardID) return setErr('Select Card')
            if (!meetingInfoID) return setErr('Select Meeting Info')
            if (!supplierID) return setErr('Select Supplier')
            if (!scheduleID) return setErr('Select Schedule')
            if (!courseID) return setErr('Select Course')
            if (!departmentID) return setErr("Select Department!")

            setIsLoading(true)
            const { data } = await axios.patch('/api/booking', {
                note, clientCardID, clientID, meetingInfoID,
                supplierID, scheduleID, courseID, settlement,
                client_quantity: Number(client_quantity), status,
                supplier_quantity: Number(supplier_quantity),
            }, {
                params: { bookingID }
            })

            if (data.ok) {
                setIsLoading(false)
                toast("Success! booking updated.")
                router.push('/admin/manage/booking')
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
    createBookingRequest: async (e: React.FormEvent, data: {
        date: string
        time: string
        router: any
    }) => {

        e.preventDefault()
        const { bookingFormData } = useAdminBookingStore.getState()
        const { setIsLoading, setErr } = useGlobalStore.getState()
        const { router, time, date } = data
        try {

            const { courseID, supplierID, clientCardID, meetingInfoID, note, clientID, status, name, client_quantity, supplier_quantity } = bookingFormData
            if (!name) return setErr("Booking name is required")
            if (!courseID) return setErr('Select Course')
            if (!supplierID) return setErr('Select Supplier')
            if (!clientCardID) return setErr('Select Card')
            if (!meetingInfoID) return setErr("Select Meeting Info")
            if (!time) return setErr("Time is required")
            if (!date) return setErr("Select Date")
            if (!client_quantity) return setErr('Client Quantity must be greater than 0')
            if (!supplier_quantity) return setErr('Supplier Quantity must be greater than 0')

            setIsLoading(true)
            const today = new Date().toISOString().split('T')[0];
            const { data } = await axios.post('/api/booking/request', {
                clientID, clientCardID, date, time, note,
                client_quantity: Number(client_quantity),
                supplier_quantity: Number(supplier_quantity),
                courseID, supplierID, meetingInfoID, settlement: today,
                operator: ADMIN, status, name
            })

            if (data.ok) {
                setIsLoading(false)
                toast('Success! booking request created.')
                get().getBookingRequests()
                router.push('/admin/manage/booking/request')
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
    createBookingOrder: async (e: React.FormEvent, setOpen: React.Dispatch<React.SetStateAction<boolean>>) => {

        const { setIsLoading, setErr } = useGlobalStore.getState()
        const { selectedBookings, getBookings } = get()

        try {
            e.preventDefault()
            if (selectedBookings.length < 1) return setErr("Select Booking to create an order")

            const bookingIds = selectedBookings.map(booking => booking.id)
            setIsLoading(true)
            const { data } = await axios.post('/api/booking/create-order', bookingIds)

            if (data.ok) {
                getBookings()
                setIsLoading(false)
                toast("Success! order created.")
                setOpen(false)
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) return setErr(error.response.data.msg)
            alert("Something went wrong")
        }
    },
    markBookingAsCompleted: async (e: React.FormEvent, setOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
        const { setIsLoading, setErr } = useGlobalStore.getState()
        const { selectedBookings, getBookings } = get()
        e.preventDefault()
        try {
            const bookingIds = selectedBookings.map(booking => booking.id)
            setIsLoading(true)
            const { data } = await axios.post('/api/booking/completed', bookingIds)

            if (data.ok) {
                getBookings()
                setIsLoading(false)
                toast("Success! booking is marked as completed.")
                setOpen(false)
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

export default useAdminBookingStore