import { Courses, SupplierMeetingInfo, SupplierProps, TotalCourse, TotalSupplier } from '@/lib/types/super-admin/supplierTypes'
import axios from 'axios'
import { create } from 'zustand'
import useGlobalStore from '../globalStore'
import { SupplierSchedule } from '@/lib/types/super-admin/scheduleType'
import useDepartmentStore from './departmentStore'
import { toast } from 'sonner'
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
    payment_schedule: '',
    username: '',
    payment_address: '',
    currency: '',
    password: '',
    email: '',
    booking_rate: '',
    employment_status: '',
    departments: [],
    address: '',
    salary: '',
    gender: '',
    note: '',
    organization: '',
    meeting_info: [{
        service: '',
        meeting_code: ''
    }],
    origin: '',
    phone_number: '',
    profile_url: '',
    profile_key: '',
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



interface SupplierPropsStore {
    supplier: SupplierProps[]
    supplierData: SupplierProps | null
    deleteSupplierModal: boolean
    selectedSupplier: SupplierProps[]
    viewSupplierModal: boolean
    totalSupplier: TotalSupplier
    totalCourse: TotalCourse
    supplierSelectedID: string
    supplierSchedule: SupplierSchedule[]
    supplierWithMeeting: SupplierProps[]
    courses: Courses[]
    supplierMeetingInfo: SupplierMeetingInfo[] | null
    getSupplierMeetingInfo: (supplierID: string) => Promise<void>
    cardCourses: Courses[] | null
    getCardCourses: (clientCardID: string) => Promise<void>
    clearCardCourses: () => void
    newCourse: boolean
    updateCourse: boolean
    selectedCourse: Courses | null
    singleSupplier: SupplierProps | null
    setTotalCourse: (total: TotalCourse) => void
    setSupplierData: (supplier: SupplierProps) => void
    setTotalSupplier: (total: TotalSupplier) => void
    closeViewSupplierModal: () => void
    openViewSupplierModal: (supplier: SupplierProps) => void
    deleteSupplierWarning: (supplier: SupplierProps) => void
    closeDeleteSupplierModal: () => void
    setSelectedSupplier: (suppliers: SupplierProps[]) => void
    getSupplier: () => Promise<void>
    getSupplierWithMeeting: () => Promise<void>
    setSupplierSelectedID: (supplierID: string) => void
    getCourses: () => Promise<void>
    toggleCreateCourse: () => void
    closeSelectedCourse: () => void
    getSingleSupplier: (supplierID: string) => Promise<void>
    openSelectedCourse: (course: Courses) => void
    setSupplierSchedule: (schedules: SupplierSchedule[]) => void
    sendSupplierPayslips: (e: React.FormEvent) => Promise<void>
}

const useAdminSupplierStore = create<SupplierPropsStore>((set, get) => ({
    supplier: [],
    supplierData: null,
    supplierWithMeeting: [],
    supplierSelectedID: '',
    deleteSupplierModal: false,
    viewSupplierModal: false,
    totalSupplier: totalSupplierValue,
    selectedSupplier: [],
    cardCourses: null,
    getCardCourses: async (clientCardID: string) => {
        try {

            const { data } = await axios.get('/api/booking/courses', { params: { clientCardID } })

            if (data.ok) set({ cardCourses: data.data })

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) return alert(error.response.data.msg)
            alert("Something went wrong")
        }
    },
    clearCardCourses: () => set({ cardCourses: null }),
    supplierMeetingInfo: null,
    getSupplierMeetingInfo: async (supplierID: string) => {
        try {

            const { data } = await axios.get('/api/booking/supplier/meeting', { params: { supplierID } })
            if (data.ok) set({ supplierMeetingInfo: data.data })

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) return alert(error.response.data.msg)
            alert('Something went wrong')
        }
    },
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
    setSupplierSelectedID: (supplierID: string) => set({ supplierSelectedID: supplierID }),
    setSupplierData: (supplier: SupplierProps) => set({ supplierData: supplier }),
    setTotalSupplier: (total: TotalSupplier) => set({ totalSupplier: total }),
    closeViewSupplierModal: () => set({ viewSupplierModal: false, supplierData: undefined }),
    openViewSupplierModal: (supplier: SupplierProps) => set({ supplierData: supplier, viewSupplierModal: true }),
    deleteSupplierWarning: (supplier: SupplierProps) => set({ deleteSupplierModal: true, supplierData: supplier }),
    closeDeleteSupplierModal: () => set({ deleteSupplierModal: false, supplierData: undefined }),
    setSelectedSupplier: (suppliers: SupplierProps[]) => set({ selectedSupplier: suppliers }),
    getSupplier: async () => {
        try {
            const { departmentID } = useDepartmentStore.getState()
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
            const { departmentID } = useDepartmentStore.getState()
            const { data } = await axios.get(`/api/booking/supplier/meeting${departmentID && `?departmentID=${departmentID}`}`)
            if (data.ok) {
                set({ supplierWithMeeting: data.data })
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
    },
    sendSupplierPayslips: async (e: React.FormEvent) => {

        const { setIsLoading, setErr } = useGlobalStore.getState()

        try {
            e.preventDefault()
            setIsLoading(true);
            const { data } = await axios.post("/api/email/payslip/supplier");
            if (data.ok) {
                setIsLoading(false);
                toast.success("Success! payslip has been sent to all suppliers.", { position: 'bottom-center' })
            }
        } catch (error: any) {
            setIsLoading(false);
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg);
            }
            alert("Something went wrong");
        }
    }

}))

export default useAdminSupplierStore
