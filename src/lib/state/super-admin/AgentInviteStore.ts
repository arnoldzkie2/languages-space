import { ClientProps, totalClientsValue } from '@/lib/state/super-admin/clientStore'
import { TotalProps } from '@/lib/types/super-admin/globalType'
import axios from 'axios'
import { create } from 'zustand'

interface Props {
    agentInvites: ClientProps[]
    getAgentInvites: (agentID: string) => Promise<void>
    selectedInvites: ClientProps[]
    setSelectedInvites: (clients: ClientProps[]) => void
    totalInvites: TotalProps
     setTotalInvites: (total: TotalProps) => void
}

const useAgentInviteStore = create<Props>((set, get) => ({
    agentInvites: [],
    getAgentInvites: async (agentID: string) => {
        try {
            const { data } = await axios.get("/api/agent/invites", { params: { agentID } })

            if (data.ok) set({ agentInvites: data.data })
        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    },
    selectedInvites: [],
    setSelectedInvites: (clients: ClientProps[]) => set({ selectedInvites: clients }),
    totalInvites: totalClientsValue,
    setTotalInvites: (total: TotalProps) => set({ totalInvites: total })
}))

export default useAgentInviteStore