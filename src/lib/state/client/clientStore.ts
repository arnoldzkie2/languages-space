import { create } from 'zustand'
import axios from 'axios';
import { ClientCard, ClientCardList } from '@/lib/types/super-admin/clientCardType';
import { Booking } from '@/lib/types/super-admin/bookingType';
import { Session } from 'next-auth';
import { Order } from '@/lib/types/super-admin/orderType'
import { SupplierPrice } from '@/lib/types/super-admin/supplierTypes';
import { useSession } from 'next-auth/react';

interface BookingFormData {
    clientCardID: string
    courseID: string
    note: string
    supplierID: string
    settlement: string
    quantity: number
    scheduleID: string
    meetingInfoID: string
}

export type { BookingFormData }

export const bookingFormDataValue = {
    scheduleID: '',
    clientCardID: '',
    quantity: 1,
    settlement: '',
    courseID: '',
    note: '',
    supplierID: '',
    meetingInfoID: ''
}

interface Props {
    page: string
    cards: ClientCard[] | null
    orders: Order[] | null
    availableSupplier: SupplierPrice[] | null
    client: Session["user"] | null
    isBooking: boolean
    bookingFormData: BookingFormData
    setPage: (page: string) => void
    setClient: (client: Session["user"]) => void
    availableCards: ClientCardList[] | null,
    bookings: Booking[] | null
    selectedCardID: string
    clearAvailableSuppliers: () => void
    getClientBookings: () => Promise<void>
    getClientOrders: () => Promise<void>
    getClientCards: () => Promise<void>
    getAvailableCards: () => Promise<void>
    setSelectedCardID: (cardID: string) => void
    getAvailableSupplier: (clientCardID: string) => Promise<void>
    setBookingFormData: (data: BookingFormData) => void
    openBookingModal: (data: BookingFormData) => void
    closeBookingModal: () => void
}

const useClientStore = create<Props>((set, get) => ({
    isBooking: false,
    bookingFormData: bookingFormDataValue,
    cards: null,
    selectedCardID: '',
    availableSupplier: null,
    availableCards: null,
    bookings: null,
    orders: null,
    clearAvailableSuppliers: () => set({ availableSupplier: null }),
    setBookingFormData: (data: BookingFormData) => set({ bookingFormData: data }),
    openBookingModal: (data: BookingFormData) => set({ bookingFormData: data, isBooking: true }),
    closeBookingModal: () => set({ isBooking: false, bookingFormData: bookingFormDataValue, availableSupplier: null }),
    getClientOrders: async () => {

        const { client } = get()

        try {

            const { data } = await axios.get('/api/client/orders', { params: { clientID: client?.id } })
            if (data.ok) set({ orders: data.data })

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    getClientBookings: async () => {

        const { client } = get()

        try {

            const { data } = await axios.get('/api/client/booking', { params: { clientID: client?.id } })
            if (data.ok) set({ bookings: data.data })

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                alert(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    },
    getClientCards: async () => {

        const { client } = get()

        try {

            const { data } = await axios.get('/api/client/card', { params: { clientID: client?.id } })
            if (data.ok) {
                set({ cards: data.data })
            }

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    },
    getAvailableCards: async () => {

        const { client } = get()

        try {

            const { data } = await axios.get('/api/client/card/available', { params: { clientID: client?.id } })

            if (data.ok) {
                set({ availableCards: data.data })
            }

        } catch (error: any) {
            console.log(error);
            alert('Something went wrong')
        }

    },
    getAvailableSupplier: async (clientCardID: string) => {

        const { client } = get()

        try {

            const { data } = await axios.get('/api/supplier/available', {
                params: { clientCardID, clientID: client?.id }
            })

            if (data.ok) set({ availableSupplier: data.data })

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    },
    setSelectedCardID: (cardID: string) => { set({ selectedCardID: cardID }) },
    page: 'profile',
    setPage: (page: string) => set({ page }),
    client: null,
    setClient: (data: Session["user"]) => set({ client: data })
}))

export default useClientStore