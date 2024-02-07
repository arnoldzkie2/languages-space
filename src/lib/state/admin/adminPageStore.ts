import { AdminPermission } from '@prisma/client'
import axios from 'axios'
import { Session } from 'next-auth'
import { create } from 'zustand'

interface AdminDepartment {
    department: {
        id: string
        name: string
    }
}

interface AdminPageStore {
    admin: Session['user'] | null
    setAdmin: (admin: Session['user']) => void
    permissions: AdminPermission | null
    adminDepartments: AdminDepartment[] | null
    getAdminDepartments: () => Promise<void>
    getPermissions: (departmentID: string) => Promise<void>
    isAdminAllowed: (permissionRequired: keyof AdminPermission) => string | boolean | Date
}

const useAdminPageStore = create<AdminPageStore>((set, get) => ({
    admin: null,
    setAdmin: (admin: Session['user']) => set({ admin }),
    permissions: null,
    getPermissions: async (departmentID: string) => {
        try {

            const { admin } = get()
            if (!admin || !departmentID) return

            const { data } = await axios.get("/api/admin/permissions", {
                params: {
                    adminID: admin.id,
                    departmentID: departmentID || null
                }
            })

            if (data.ok) set({ permissions: data.data })

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    },
    adminDepartments: null,
    getAdminDepartments: async () => {

        try {

            const { data } = await axios.get('/api/admin/department')
            if (data.ok) set({ adminDepartments: data.data })

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    },
    isAdminAllowed: (permissionRequired: keyof AdminPermission) => {
        const { admin, permissions } = get()
        if (admin) {
            return permissions && permissions[permissionRequired] || false
        } else {
            return true
        }
    }
}))

export default useAdminPageStore