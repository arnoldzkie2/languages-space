import { Department, TotalProps } from "@/lib/types/super-admin/globalType"
import axios from "axios"
import { create } from "zustand"

const totalDepartmentValue = {
    selected: '',
    total: '',
    searched: ''
}

interface AdminGlobalStoreProps {
    isSideNavOpen: boolean
    currentPage: number
    departmentID: string
    isCreatingDepartment: boolean
    departments: Department[]
    err: string
    eye: boolean
    itemsPerPage: number
    totalDepartment: TotalProps
    locales: { loc: string, val: string }[]
    okMsg: string
    skeleton: number[]
    newDepartment: boolean,
    updateDepartment: boolean
    departmentData: Department | null
    toggleSideNav: () => void
    setDepartments: (depts: Department[]) => void
    setDepartmentID: (id: string) => void
    toggleIsCreatingDepartment: () => void
    setCurrentPage: (num: number) => void
    getDepartments: () => Promise<void>
    isLoading: boolean
    setIsLoading: (type: boolean) => void
    operation: boolean
    selectedID: string
    deleteDepartment: boolean
    openOperation: (ID: string) => void
    closeOperation: () => void
    setOkMsg: (msg: string) => void
    setTotalDepartments: (total: TotalProps) => void
    toggleNewDepartment: () => void
    closeUpdateDepartment: () => void
    toggleEye: () => void
    closeDeleteDepartment: () => void
    openUpdateDepartment: (dept: Department) => void
    openDeleteDepartment: (dept: Department) => void
    setErr: (err: string) => void
}

const useAdminGlobalStore = create<AdminGlobalStoreProps>((set) => ({
    isSideNavOpen: false,
    okMsg: '',
    locales: [{
        loc: 'en',
        val: 'English'
    },
    {
        loc: 'ja',
        val: '日本語' // Japanese
    },
    {
        loc: 'zh',
        val: '中文' // Chinese (Simplified)
    },
    {
        loc: 'vi',
        val: 'Tiếng Việt' // Vietnamese
    },
    {
        loc: 'kr',
        val: '한국어' // Korean
    }],
    setOkMsg: (msg: string) => set({ okMsg: msg }),
    toggleSideNav: () => set(state => ({ isSideNavOpen: !state.isSideNavOpen })),
    departments: [],
    err: '',
    setErr: (err: string) => set({ err: err }),
    setDepartments: (depts: Department[]) => set(state => ({ departments: depts })),
    getDepartments: async () => {
        try {

            const { data } = await axios.get('/api/department')
            if (data.ok) set({ departments: data.data })

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    totalDepartment: totalDepartmentValue,
    newDepartment: false,
    updateDepartment: false,
    skeleton: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    currentPage: 1,
    departmentID: '',
    itemsPerPage: 10,
    eye: false,
    departmentData: null,
    isLoading: false,
    isCreatingDepartment: false,
    operation: false,
    selectedID: '',
    deleteDepartment: false,
    closeDeleteDepartment: () => set({ deleteDepartment: false, departmentData: null }),
    openDeleteDepartment: (dept: Department) => set({ departmentData: dept, deleteDepartment: true }),
    openUpdateDepartment: (dept: Department) => set(state => ({ departmentData: dept, updateDepartment: true })),
    closeUpdateDepartment: () => set((state) => ({ updateDepartment: false, departmentData: null })),
    toggleNewDepartment: () => set((state) => ({ newDepartment: !state.newDepartment })),
    setTotalDepartments: (total: TotalProps) => set({ totalDepartment: total }),
    setCurrentPage: (num: number) => set({ currentPage: num }),
    setDepartmentID: (id: string) => set({ departmentID: id }),
    toggleIsCreatingDepartment: () => set(state => ({ isCreatingDepartment: !state.isCreatingDepartment })),
    toggleEye: () => set(state => ({ eye: !state.eye })),
    setIsLoading: (type: boolean) => set({ isLoading: type }),
    openOperation: (ID: string) => set({ operation: true, selectedID: ID }),
    closeOperation: () => set({ operation: false, selectedID: '' })
}))

export default useAdminGlobalStore
