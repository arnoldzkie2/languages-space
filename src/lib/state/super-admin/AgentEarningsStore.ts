import { TotalProps } from '@/lib/types/super-admin/globalType'
import { AgentEarnings } from '@prisma/client'
import axios from 'axios'
import { create } from 'zustand'
import { totalClientsValue } from './clientStore'

interface Props {
    selectedEarnings: AgentEarnings[]
    setSelectedEarnings: (deductions: AgentEarnings[]) => void
    agentEarnings: AgentEarnings[]
    getAgentEarnings: (agentID: string) => Promise<void>,
    totalEarnings: TotalProps
    setTotalEarnings: (total: TotalProps) => void
}

const useAgentEarningsStore = create<Props>((set, get) => ({
    agentEarnings: [],
    getAgentEarnings: async (agentID: string) => {
        try {

            const { data } = await axios.get('/api/agent/balance/earnings', { params: { agentID } })

            if (data.ok) set({ agentEarnings: data.data })

        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    },
    selectedEarnings: [],
    setSelectedEarnings: (deductions: AgentEarnings[]) => set({ selectedEarnings: deductions }),
    totalEarnings: totalClientsValue,
    setTotalEarnings: (total: TotalProps) => set({ totalEarnings: total })
}))

export default useAgentEarningsStore