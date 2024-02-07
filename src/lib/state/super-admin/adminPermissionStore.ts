import axios from 'axios'
import { create } from 'zustand'
import useGlobalStore from '../globalStore'
import { AdminPermission } from '@prisma/client'
import useDepartmentStore from './departmentStore'
import { toast } from 'sonner'

interface AdminPermissionStore {
    permissionData: AdminPermission | null
    setPermissionData: (data: AdminPermission) => void
    retrieveAdminPermission: (adminID: string) => Promise<void>
    showCreatePermissionButton: boolean
    setShowCreatePermissionButton: (state: boolean) => void
    createPermission: (e: React.FormEvent, adminID: string) => Promise<void>
    clearPermissionData: () => void
    updatePermission: (e: React.FormEvent, adminID: string) => Promise<void>
    deleteAgentPermission: (e: React.MouseEvent) => Promise<void>
}

const useAdminPermissionStore = create<AdminPermissionStore>((set, get) => ({
    permissionData: null,
    setPermissionData: (data: AdminPermission) => set({ permissionData: data }),
    clearPermissionData: () => set({ permissionData: null }),
    showCreatePermissionButton: false,
    setShowCreatePermissionButton: (state: boolean) => set({ showCreatePermissionButton: state }),
    retrieveAdminPermission: async (adminID: string) => {

        const { departmentID } = useDepartmentStore.getState()
        const { setErr } = useGlobalStore.getState()
        try {

            const { data } = await axios.get('/api/admin/permissions', {
                params: {
                    adminID, departmentID
                }
            })
            if (data.ok) {
                set({ showCreatePermissionButton: false, permissionData: data.data })
            }

        } catch (error: any) {
            console.error(error);
            if (error.response.status === 404) {
                set({ showCreatePermissionButton: true })
            }
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    },
    createPermission: async (e: React.FormEvent, adminID: string) => {
        e.preventDefault()

        const { departmentID } = useDepartmentStore.getState()
        const { setIsLoading, setErr } = useGlobalStore.getState()
        const { retrieveAdminPermission } = get()
        try {

            setIsLoading(true)
            const { data } = await axios.post('/api/admin/permissions', {
                departmentID, adminID
            })

            if (data.ok) {
                setIsLoading(false)
                toast("Success! Admin now have permission in this department.")
                retrieveAdminPermission(adminID)
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    },
    updatePermission: async (e: React.FormEvent, adminID: string) => {
        e.preventDefault()
        const { setIsLoading, setOkMsg, setErr } = useGlobalStore.getState()
        const { permissionData, retrieveAdminPermission } = get()
        try {

            if (permissionData) {

                setIsLoading(true)
                const { data } = await axios.patch('/api/admin/permissions', permissionData)

                if (data.ok) {
                    setIsLoading(false)
                    retrieveAdminPermission(adminID)
                    toast("Success! permissions updated.")
                }
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    },
    deleteAgentPermission: async (e: React.MouseEvent) => {
        const { setIsLoading, setOkMsg, setErr } = useGlobalStore.getState()
        const { permissionData } = get()
        try {
            e.preventDefault()

            if (permissionData) {

                setIsLoading(true)

                const { data } = await axios.delete('/api/admin/permissions', {
                    params: {
                        adminPermissionID: permissionData.id
                    }
                })

                if (data.ok) {
                    setIsLoading(false)
                    toast("Success! permissions deleted.")
                    set({ permissionData: null })
                }

            }

        } catch (error: any) {
            setIsLoading(false)
            console.error(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    }
}))

export default useAdminPermissionStore