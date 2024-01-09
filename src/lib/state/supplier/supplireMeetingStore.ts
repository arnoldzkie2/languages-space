import { SupplierMeetingInfo } from '@/lib/types/super-admin/supplierTypes'
import axios from 'axios'
import { create } from 'zustand'
import useGlobalStore from '../globalStore'

interface SupplierMeetingStore {
    meetingInfo: SupplierMeetingInfo[] | null
    getSupplierMeeting: () => Promise<void>
    addMoreMeetingInfo: () => void
    removeMeetingInfo: (index: number) => void
    updateMeeting: (e: React.FormEvent) => Promise<void>
    handleMeetinInfoChange: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void
}

const useSupplierMeetingStore = create<SupplierMeetingStore>((set, get) => ({
    meetingInfo: null,
    getSupplierMeeting: async () => {
        try {
            const { data } = await axios.get('/api/supplier/meeting')
            if (data.ok) set({ meetingInfo: data.data })

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert('Something weng wrong')
        }
    },
    addMoreMeetingInfo: () => {
        const { meetingInfo } = get()
        const updatedMeetingInfo = [...meetingInfo!, { service: '', meeting_code: '' }] as SupplierMeetingInfo[]
        set({ meetingInfo: updatedMeetingInfo })
    },
    removeMeetingInfo: (index: number) => {
        const { meetingInfo } = get()
        const updatedMeetingInfo = [...meetingInfo!];
        updatedMeetingInfo.splice(index, 1);
        set({ meetingInfo: updatedMeetingInfo })
    },
    updateMeeting: async (e: React.FormEvent) => {
        e.preventDefault()

        const { setIsLoading, setOkMsg, setErr } = useGlobalStore.getState()

        const { meetingInfo } = get()

        try {

            setIsLoading(true)
            const { data } = await axios.patch('/api/supplier/meeting', { meetingInfo })

            if (data.ok) {
                setOkMsg('Success')
                setIsLoading(false)
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    },
    handleMeetinInfoChange: (event: React.ChangeEvent<HTMLInputElement>, index: number) => {

        const { meetingInfo } = get()
        const updatedMeetingInfo = [...meetingInfo!]
        const propertyName = event.target.name as keyof typeof updatedMeetingInfo[0];
        updatedMeetingInfo[index][propertyName] = event.target.value;
        set({ meetingInfo: updatedMeetingInfo })
    }
}))

export default useSupplierMeetingStore