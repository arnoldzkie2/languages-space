import { Department } from '@prisma/client'
import axios from 'axios'
import { create } from 'zustand'

interface DepartmentStore {
    departmentID: string
    departments: Department[]
    newDepartment: boolean,
    updateDepartment: boolean
    departmentData: Department | null
    setDepartments: (depts: Department[]) => void
    setDepartmentID: (id: string) => void
    getDepartments: () => Promise<void>
    deleteDepartment: boolean
    openUpdateDepartment: (dept: Department) => void
    closeUpdateDepartment: () => void
    openDeleteDepartment: (dept: Department) => void
    closeDeleteDepartment: () => void
    openNewDepartment: () => void
    closeNewDepartment: () => void
}

const useDepartmentStore = create<DepartmentStore>((set, get) => ({
    departments: [],
    departmentData: null,
    departmentID: '',
    newDepartment: false,
    updateDepartment: false,
    deleteDepartment: false,
    getDepartments: async () => {
        try {

            const { data } = await axios.get('/api/department')
            if (data.ok) set({ departments: data.data })

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    setDepartments: (depts: Department[]) => set(state => ({ departments: depts })),
    setDepartmentID: (id: string) => set({ departmentID: id }),
    openDeleteDepartment: (dept: Department) => set({ departmentData: dept, deleteDepartment: true }),
    closeDeleteDepartment: () => set({ deleteDepartment: false, departmentData: null }),
    openUpdateDepartment: (dept: Department) => set(state => ({ departmentData: dept, updateDepartment: true })),
    closeUpdateDepartment: () => set((state) => ({ updateDepartment: false, departmentData: null })),
    openNewDepartment: () => set({ newDepartment: true }),
    closeNewDepartment: () => set({ newDepartment: false }),
}))

export default useDepartmentStore