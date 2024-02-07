import { TotalProps } from '@/lib/types/super-admin/globalType'
import { AgentDeductions } from '@prisma/client'
import axios from 'axios'
import { create } from 'zustand'
import { totalClientsValue } from './clientStore'

interface Props {
    selectedDeductions: AgentDeductions[]
    setSelectedDeductions: (deductions: AgentDeductions[]) => void
    agentDeductions: AgentDeductions[]
    getAgentDeductions: (agentID: string) => Promise<void>,
    totalDeductions: TotalProps
    setTotalDeductions: (total: TotalProps) => void
}

const useAgentDeductionStore = create<Props>((set, get) => ({
    agentDeductions: [],
    getAgentDeductions: async (agentID: string) => {
        try {

            const { data } = await axios.get('/api/agent/balance/deductions', { params: { agentID } })

            if (data.ok) set({ agentDeductions: data.data })

        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    },
    selectedDeductions: [],
    setSelectedDeductions: (deductions: AgentDeductions[]) => set({ selectedDeductions: deductions }),
    totalDeductions: totalClientsValue,
    setTotalDeductions: (total: TotalProps) => set({ totalDeductions: total })
}))

export default useAgentDeductionStore