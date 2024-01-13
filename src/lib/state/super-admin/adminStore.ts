import { Admin } from '@prisma/client'
import axios from 'axios'
import { create } from 'zustand'
import useGlobalStore from '../globalStore'
import { TotalProps } from '@/lib/types/super-admin/globalType'
import { totalClientsValue } from './clientStore'


const adminSearchQueryValue = {
    name: '',
    organization: '',
    origin: '',
    note: '',
    phone_number: ''
}

const adminFormDataValue = {
    name: '',
    username: '',
    password: '',
    email: '',
    departments: [],
    address: '',
    origin: '',
    organization: '',
    gender: '',
    note: '',
    phone_number: '',
    profile_key: '',
    profile_url: '',
}

export { adminSearchQueryValue, adminFormDataValue }


interface AdminStore {
    admins: Admin[]
    getAdmins: () => Promise<void>
    selectedAdmins: Admin[]
    setSelectedAdmins: (admins: Admin[]) => void
    deleteAdminModal: boolean
    adminData: Admin | null
    openDeleteAdminModal: (admin: Admin) => void
    closeDeleteAdminModal: () => void
    totalAdmin: TotalProps
    setTotalAdmin: (total: TotalProps) => void
}

const useAdminStore = create<AdminStore>((set, get) => ({
    admins: [],
    getAdmins: async () => {

        const departmentID = useGlobalStore.getState().departmentID
        try {
            const { data } = await axios.get('/api/admin', {
                params: {
                    departmentID: departmentID || null
                }
            })
            if (data.ok) {
                set({ admins: data.data })
            }

        } catch (error) {
            console.error(error);
            alert("Something went wrong")
        }
    },
    selectedAdmins: [],
    setSelectedAdmins: (admins: Admin[]) => set({ selectedAdmins: admins }),
    deleteAdminModal: false,
    adminData: null,
    openDeleteAdminModal: (admin: Admin) => set({ adminData: admin, deleteAdminModal: true }),
    closeDeleteAdminModal: () => set({ adminData: null, deleteAdminModal: false }),
    totalAdmin: totalClientsValue,
    setTotalAdmin: (total: TotalProps) => set({ totalAdmin: total }),
}))

export default useAdminStore