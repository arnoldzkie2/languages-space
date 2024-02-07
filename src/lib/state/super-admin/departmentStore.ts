import { Department } from '@prisma/client'
import axios from 'axios'
import { create } from 'zustand'
import useGlobalStore from '../globalStore'
import { toast } from 'sonner'
import { TotalProps } from '@/lib/types/super-admin/globalType'
import { totalNewsValue } from './newsStore'

interface DepartmentStore {
    departmentID: string
    departments: Department[] | null
    newDepartment: boolean,
    updateDepartment: boolean
    departmentData: Department | null
    setDepartments: (depts: Department[]) => void
    setDepartmentID: (id: string) => void
    getDepartments: () => Promise<void>
    deleteDepartment: boolean
    closeUpdateDepartment: () => void
    openDeleteDepartment: (dept: Department) => void
    closeDeleteDepartment: () => void
    openNewDepartment: () => void
    closeNewDepartment: () => void
    openUpdateDepartment: (dept: Department) => void
    deleteSingleDepartment: (e: React.FormEvent, departmentID: string) => Promise<string | number | undefined>
    totalDepartment: TotalProps
    setTotalDepartment: (total: TotalProps) => void
}

const useDepartmentStore = create<DepartmentStore>((set, get) => ({
    departments: null,
    departmentData: null,
    departmentID: '',
    newDepartment: false,
    updateDepartment: false,
    deleteDepartment: false,
    totalDepartment: totalNewsValue,
    setTotalDepartment: (total: TotalProps) => set({ totalDepartment: total }),
    getDepartments: async () => {
        try {

            const { data } = await axios.get('/api/department')
            if (data.ok) set({ departments: data.data })

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    setDepartments: (depts: Department[]) => set(({ departments: depts })),
    setDepartmentID: (id: string) => set({ departmentID: id }),
    openDeleteDepartment: (dept: Department) => set({ departmentData: dept, deleteDepartment: true }),
    closeDeleteDepartment: () => set({ deleteDepartment: false, departmentData: null }),
    openUpdateDepartment: (dept: Department) => set({ departmentData: dept, updateDepartment: true }),
    closeUpdateDepartment: () => set((state) => ({ updateDepartment: false, departmentData: null })),
    openNewDepartment: () => set({ newDepartment: true }),
    closeNewDepartment: () => set({ newDepartment: false }),
    deleteSingleDepartment: async (e: React.FormEvent, departmentID: string) => {
        e.preventDefault();
        const { setIsLoading } = useGlobalStore.getState()
        const { closeDeleteDepartment, getDepartments } = get()
        try {
            setIsLoading(true);
            const { data } = await axios.delete('/api/department', {
                params: { departmentID }
            });

            if (data.ok) {
                getDepartments();
                setIsLoading(false);
                closeDeleteDepartment();
                toast('Success! department has been deleted');
            }

        } catch (error: any) {
            setIsLoading(false);
            console.log(error);
            if (error.response.data.msg) {
                return toast(error.response.data.msg)
            }
            alert('Something went wrong');
        }
    }
}))

export default useDepartmentStore