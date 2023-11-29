import { Client } from '@/lib/types/super-admin/clientType'
import { create } from 'zustand'

interface Props {
    page: string
    setPage: (page: string) => void
}

const useClientStore = create<Props>((set, get) => ({
    page: 'profile',
    setPage: (page: string) => set({ page })
}))

export default useClientStore