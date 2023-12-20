import { Agent } from '@/lib/types/super-admin/agentType'
import axios from 'axios'
import { create } from 'zustand'
import useAdminGlobalStore from './globalStore'
import { TotalProps } from '@/lib/types/super-admin/globalType'
import { totalClientsValue } from './clientStore'

const ManageAgentSearchQueryValue = {
    name: '',
    phone_number: '',
    organization: '',
    origin: '',
    note: '',
}

export { ManageAgentSearchQueryValue }


interface Props {
    agents: Agent[]
    selectedAgents: Agent[]
    setSelectedAgents: (agents: Agent[]) => void
    getAgents: () => Promise<void>
    totalAgent: TotalProps
    setTotalAgent: (total: TotalProps) => void

}

const useAdminAgentStore = create<Props>((set, get) => ({
    agents: [],
    selectedAgents: [],
    setSelectedAgents: (agents: Agent[]) => set({ selectedAgents: agents }),
    getAgents: async () => {
        try {

            const { departmentID } = useAdminGlobalStore.getState()

            const { data } = await axios.get(`/api/agent${departmentID && `?departmentID=${departmentID}`}`)

            if (data.ok) set({ agents: data.data })

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    },
    totalAgent: totalClientsValue,
    setTotalAgent: (total: TotalProps) => set({ totalAgent: total })
}))

export default useAdminAgentStore