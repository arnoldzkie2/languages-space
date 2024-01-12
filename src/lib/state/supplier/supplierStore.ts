import { Session } from 'next-auth'
import { create } from 'zustand'

interface Props {
    supplier: Session['user'] | null
    setSupplier: (data: Session['user']) => void
    page: string
    setPage: (page: string) => void
}

const useSupplierStore = create<Props>((set, get) => ({
    supplier: null,
    setSupplier: (data: Session['user']) => set({ supplier: data }),
    page: '',
    setPage: (page: string) => set({ page }),
}))

export default useSupplierStore