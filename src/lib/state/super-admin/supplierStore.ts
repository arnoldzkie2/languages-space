import { Courses, Supplier, SupplierMeetingInfo, TotalCourse, TotalSupplier } from '@/lib/types/super-admin/supplierTypes'
import axios from 'axios'
import { create } from 'zustand'
import useAdminGlobalStore from './globalStore'
import { SupplierSchedule } from '@/lib/types/super-admin/scheduleType'
const totalSupplierValue = {
    total: '',
    searched: '',
    selected: ''
}

const totalCoursesValue = {
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

export { totalSupplierValue, supplierFormDataValue, manageSupplierSearchQueryValue, totalCoursesValue }

interface SupplierProps {
    supplier: Supplier[]
    supplierData: Supplier | null
    deleteSupplierModal: boolean
    selectedSupplier: Supplier[]
    viewSupplierModal: boolean
    totalSupplier: TotalSupplier
    totalCourse: TotalCourse
    supplierSelectedID: string
    supplierSchedule: SupplierSchedule[]
    courses: Courses[]
    supplierMeetingInfo: SupplierMeetingInfo[]
    cardCourses: Courses[]
    newCourse: boolean
    updateCourse: boolean
    selectedCourse: Courses | null
    singleSupplier: Supplier | null
    setTotalCourse: (total: TotalCourse) => void
    setSupplierData: (supplier: Supplier) => void
    setTotalSupplier: (total: TotalSupplier) => void
    closeViewSupplierModal: () => void
    openViewSupplierModal: (supplier: Supplier) => void
    deleteSupplierWarning: (supplier: Supplier) => void
    closeDeleteSupplierModal: () => void
    setSelectedSupplier: (suppliers: Supplier[]) => void
    getSupplier: () => Promise<void>
    getSupplierWithMeeting: () => Promise<void>
    setSupplierSelectedID: (supplierID: string) => void
    setSupplierMeetingInfo: (meetingInfo: SupplierMeetingInfo[]) => void
    getCourses: () => Promise<void>
    toggleCreateCourse: () => void
    closeSelectedCourse: () => void
    getSingleSupplier: (supplierID: string) => Promise<void>
    openSelectedCourse: (course: Courses) => void
    setCardCourses: (courses: Courses[]) => void
    setSupplierSchedule: (schedules: SupplierSchedule[]) => void

}

const useAdminSupplierStore = create<SupplierProps>((set, get) => ({
    supplier: [],
    supplierData: null,
    supplierSelectedID: '',
    deleteSupplierModal: false,
    viewSupplierModal: false,
    totalSupplier: totalSupplierValue,
    selectedSupplier: [],
    cardCourses: [],
    supplierMeetingInfo: [],
    singleSupplier: null,
    supplierSchedule: [],
    newCourse: false,
    courses: [],
    updateCourse: false,
    totalCourse: totalCoursesValue,
    selectedCourse: null,
    setSupplierSchedule: (schedules: SupplierSchedule[]) => set({ supplierSchedule: schedules }),
    setTotalCourse: (total: TotalCourse) => set({ totalCourse: total }),
    openSelectedCourse: (course: Courses) => set({ selectedCourse: course, updateCourse: true }),
    closeSelectedCourse: () => set({ selectedCourse: null, updateCourse: false }),
    toggleCreateCourse: () => set((state) => ({ newCourse: !state.newCourse })),
    setSupplierMeetingInfo: (meetingInfo: SupplierMeetingInfo[]) => set({ supplierMeetingInfo: meetingInfo }),
    setSupplierSelectedID: (supplierID: string) => set({ supplierSelectedID: supplierID }),
    setSupplierData: (supplier: Supplier) => set({ supplierData: supplier }),
    setTotalSupplier: (total: TotalSupplier) => set({ totalSupplier: total }),
    closeViewSupplierModal: () => set({ viewSupplierModal: false, supplierData: undefined }),
    openViewSupplierModal: (supplier: Supplier) => set({ supplierData: supplier, viewSupplierModal: true }),
    deleteSupplierWarning: (supplier: Supplier) => set({ deleteSupplierModal: true, supplierData: supplier }),
    closeDeleteSupplierModal: () => set({ deleteSupplierModal: false, supplierData: undefined }),
    setSelectedSupplier: (suppliers: Supplier[]) => set({ selectedSupplier: suppliers }),
    setCardCourses: (courses: Courses[]) => set({ cardCourses: courses }),
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
    getSingleSupplier: async (supplierID: string) => {
        try {

            const { data } = await axios.get('/api/supplier', {
                params: { supplierID }
            })

            if (data.ok) {
                set({ singleSupplier: data.data })
            }

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    getSupplierWithMeeting: async () => {
        try {
            const { departmentID } = useAdminGlobalStore.getState()
            const { data } = await axios.get(`/api/supplier/meeting${departmentID && `?departmentID=${departmentID}`}`)
            if (data.ok) {
                set({ supplier: data.data })
            }
        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    getCourses: async () => {
        try {
            const { data } = await axios.get('/api/courses')
            if (data.ok) {
                set({ courses: data.data })
            }
        } catch (error) {
            console.log(error);
        }
    }
}))

export default useAdminSupplierStore
