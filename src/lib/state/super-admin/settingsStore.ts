import { Settings } from '@prisma/client'
import axios from 'axios'
import { toast } from 'sonner'
import { create } from 'zustand'

interface SettingsProps {
    settings: Settings | null
    setSettings: (data: Settings) => void
    getSettings: () => Promise<void>
    updateSettings: (e: React.MouseEvent) => Promise<void>
}

const useSettingsStore = create<SettingsProps>((set, get) => ({
    settings: null,
    getSettings: async () => {
        try {
            const { data } = await axios.get('/api/settings')

            if (data.ok) set({ settings: data.data })

        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    },
    setSettings: (data: Settings) => set({ settings: data }),
    updateSettings: async (e: React.MouseEvent) => {

        e.preventDefault()
        const { settings } = get()

        try {

            const { data } = await axios.patch('/api/settings', settings)

            if (data.ok) toast.success("Success! settings updated.", {
                position: 'bottom-left'
            })

        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    }
}))

export default useSettingsStore