import { Supplier, SupplierMeetingInfo, TotalSupplier } from '@/lib/types/super-admin/supplierTypes'
import axios from 'axios'
import { create } from 'zustand'
import useAdminGlobalStore from './globalStore'
const totalSupplierValue = {
    total: '',
    searched: '',
    selected: ''
}

const supplierFormDataValue = {
    name: '',
    user_name: '',
    payment_info: '',
    password: '',
    email: '',
    employment_status: '',
    departments: [],
    address: '',
    gender: '',
    note: '',
    organization: '',
    meeting_info: [{
        service: '',
        meeting_code: ''
    }],
    origin: '',
    phone_number: '',
    profile: '',
    tags: []
}

const manageSupplierSearchQueryValue = {
    name: '',
    phone_number: '',
    organization: '',
    origin: '',
    note: ''
}

export { totalSupplierValue, supplierFormDataValue, manageSupplierSearchQueryValue }

interface SupplierProps {
    supplier: Supplier[]
    supplierData: Supplier | undefined
    deleteSupplierModal: boolean
    selectedSupplier: Supplier[]
    viewSupplierModal: boolean
    totalSupplier: TotalSupplier
    supplierSelectedID: string
    supplierMeetingInfo: SupplierMeetingInfo[],
    setSupplierData: (supplier: Supplier) => void
    setTotalSupplier: (total: TotalSupplier) => void
    closeViewSupplierModal: () => void
    openViewSupplierModal: (supplier: Supplier) => void
    deleteSupplierWarning: (supplier: Supplier) => void
    closeDeleteSupplierModal: () => void
    setSelectedSupplier: (suppliers: Supplier[]) => void
    getSupplier: () => Promise<void>
    setSupplierSelectedID: (supplierID: string) => void
    setSupplierMeetingInfo: (meetingInfo: SupplierMeetingInfo[]) => void
}

const useAdminSupplierStore = create<SupplierProps>((set, get) => ({
    supplier: [],
    supplierData: undefined,
    supplierSelectedID: '',
    deleteSupplierModal: false,
    viewSupplierModal: false,
    totalSupplier: totalSupplierValue,
    selectedSupplier: [],
    supplierMeetingInfo: [],
    setSupplierMeetingInfo: (meetingInfo: SupplierMeetingInfo[]) => set({ supplierMeetingInfo: meetingInfo }),
    setSupplierSelectedID: (supplierID: string) => set({ supplierSelectedID: supplierID }),
    setSupplierData: (supplier: Supplier) => set({ supplierData: supplier }),
    setTotalSupplier: (total: TotalSupplier) => set({ totalSupplier: total }),
    closeViewSupplierModal: () => set({ viewSupplierModal: false, supplierData: undefined }),
    openViewSupplierModal: (supplier: Supplier) => set({ supplierData: supplier, viewSupplierModal: true }),
    deleteSupplierWarning: (supplier: Supplier) => set({ deleteSupplierModal: true, supplierData: supplier }),
    closeDeleteSupplierModal: () => set({ deleteSupplierModal: false, supplierData: undefined }),
    setSelectedSupplier: (suppliers: Supplier[]) => set({ selectedSupplier: suppliers }),
    getSupplier: async () => {

        try {

            const { departmentID } = useAdminGlobalStore.getState()

            const { data } = await axios.get(`/api/supplier${departmentID && `?departmentID=${departmentID}`}`)

            if (data.ok) {

                set({ supplier: data.data })

            }

        } catch (error) {

            console.log(error);

            alert('Something went wrong')

        }
    },
}))

export default useAdminSupplierStore
