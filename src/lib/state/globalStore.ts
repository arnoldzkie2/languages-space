import {  TotalProps } from "@/lib/types/super-admin/globalType"
import axios from "axios"
import { toast } from "sonner"
import { create } from "zustand"

const totalDepartmentValue = {
    selected: '',
    total: '',
    searched: ''
}

interface AdminGlobalStoreProps {
    isSideNavOpen: boolean
    currentPage: number
    err: string
    eye: boolean
    page: string
    setPage: (page: string) => void
    itemsPerPage: number
    totalDepartment: TotalProps
    locales: { loc: string, val: string }[]
    okMsg: string
    skeleton: number[]
    prevProfileKey: string
    setPrevProfileKey: (profile: string) => void
    deleteProfile: (profileKey: string) => Promise<void>
    toggleSideNav: () => void
    setCurrentPage: (num: number) => void
    isLoading: boolean
    setIsLoading: (type: boolean) => void
    operation: boolean
    selectedID: string
    deleteDepartment: boolean
    openOperation: (ID: string) => void
    closeOperation: () => void
    setOkMsg: (msg: string) => void
    toggleEye: () => void
    copy: (value: any) => void
    setErr: (err: string) => void
    truncateText: string
    returnTruncateText: (text: string, maxLength: number) => string
    openTruncateTextModal: (text: string) => void
    closeTruncateTextModal: () => void
}

const useGlobalStore = create<AdminGlobalStoreProps>((set) => ({
    isSideNavOpen: false,
    okMsg: '',
    page: '',
    setPage: (page: string) => set({ page }),
    prevProfileKey: '',
    setPrevProfileKey: (profile: string) => set({ prevProfileKey: profile }),
    deleteProfile: async (profileKey: string) => {
        try {
            await axios.delete('/api/uploadthing', { params: { key: profileKey } })
        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
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
    copy: (value: any) => {
        navigator.clipboard.writeText(value)
        toast(`Copied ${value}`)
    },
    setOkMsg: (msg: string) => {
        set({ okMsg: msg, err: '' })
        setTimeout(() => {
            set({ okMsg: '' })
        }, 5000)
    },
    toggleSideNav: () => set(state => ({ isSideNavOpen: !state.isSideNavOpen })),
    departments: [],
    err: '',
    setErr: (err: string) => {
        set({ err, okMsg: '' })
        setTimeout(() => {
            set({ err: '' })
        }, 5000)
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
    operation: false,
    selectedID: '',
    deleteDepartment: false,
    setCurrentPage: (num: number) => set({ currentPage: num }),
    toggleEye: () => set(state => ({ eye: !state.eye })),
    setIsLoading: (type: boolean) => set({ isLoading: type }),
    openOperation: (ID: string) => set({ operation: true, selectedID: ID }),
    closeOperation: () => set({ operation: false, selectedID: '' }),
    returnTruncateText: (text: string, maxLength: number) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    },
    truncateText: '',
    openTruncateTextModal: (text: string) => set({ truncateText: text }),
    closeTruncateTextModal: () => set({ truncateText: '' })
}))

export default useGlobalStore
