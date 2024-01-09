import { Booking } from '@/lib/types/super-admin/bookingType'
import axios from 'axios'
import { Session } from 'next-auth'
import { create } from 'zustand'

interface Props {
    supplier: Session['user'] | null
    setSupplier: (data: Session['user']) => void
    page: string
    setPage: (page: string) => void
    cleanSchedule: boolean
}

const useSupplierStore = create<Props>((set, get) => ({
    supplier: null,
    setSupplier: (data: Session['user']) => set({ supplier: data }),
    page: '',
    setPage: (page: string) => set({ page }),
    cleanSchedule: false,
}))

export default useSupplierStore