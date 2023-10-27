import axios from "axios"
import { create } from "zustand"


interface Department {
    id: string,
    name: string,
    date: string
}

export type { Department }

interface AdminGlobalStoreProps {
    isSideNavOpen: boolean
    currentPage: number
    departmentID: string
    isCreatingDepartment: boolean
    departments: Department[]
    eye: boolean
    itemsPerPage: number
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
    openOperation: (ID: string) => void
    closeOperation: () => void
}

const useAdminGlobalStore = create<AdminGlobalStoreProps>((set) => ({
    isSideNavOpen: false,
    toggleSideNav: () => set(state => ({ isSideNavOpen: !state.isSideNavOpen })),
    departments: [],
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
    currentPage: 1,
    itemsPerPage: 10,
    setCurrentPage: (num: number) => set({ currentPage: num }),
    departmentID: '',
    setDepartmentID: (id: string) => set({ departmentID: id }),
    isCreatingDepartment: false,
    toggleIsCreatingDepartment: () => set(state => ({ isCreatingDepartment: !state.isCreatingDepartment })),
    eye: false,
    toggleEye: () => set(state => ({ eye: !state.eye })),
    isLoading: false,
    setIsLoading: (type: boolean) => set({ isLoading: type }),
    operation: false,
    selectedID: '',
    openOperation: (ID: string) => set({ operation: true, selectedID: ID }),
    closeOperation: () => set({ operation: false, selectedID: '' })
}))

export default useAdminGlobalStore
