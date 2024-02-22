import axios from 'axios'
import { create } from 'zustand'
import useGlobalStore from '../globalStore'
import { TotalProps } from '@/lib/types/super-admin/globalType'
import { totalClientsValue } from './clientStore'
import { AgentFormDataValueProps } from '@/lib/types/super-admin/agentType'
import useDepartmentStore from './departmentStore'
import { toast } from 'sonner'
import { Agent } from '@prisma/client'

const agentSearchQueryValue = {
    username: '',
    phone_number: '',
    organization: '',
    origin: '',
    note: '',
}

const agentFormDataValue = {
    name: '',
    username: '',
    payment_address: '',
    currency: '',
    password: '',
    commission_rate: '',
    commission_type: 'fixed',
    email: '',
    employment_status: '',
    departments: [],
    address: '',
    gender: '',
    note: '',
    organization: '',
    origin: '',
    phone_number: '',
    profile_url: '',
    profile_key: '',
}

export { agentSearchQueryValue, agentFormDataValue }


interface AgentProps extends Agent {
    deductions: boolean
    earnings: boolean
    invites: boolean
}

export type { AgentProps }

interface Props {
    agents: AgentProps[]
    agentData: AgentProps | null,
    selectedAgents: AgentProps[]
    setSelectedAgents: (agents: AgentProps[]) => void
    getAgents: () => Promise<void>
    totalAgent: TotalProps
    setTotalAgent: (total: TotalProps) => void
    agentFormData: AgentFormDataValueProps
    deleteAgentModal: boolean
    openDeleteAgentModal: (agent: AgentProps) => void
    closeDeleteAgentModal: () => void
    sendAgentPayslip: (e: React.FormEvent) => Promise<void>
}
const useAdminAgentStore = create<Props>((set, get) => ({
    agents: [],
    agentData: null,
    selectedAgents: [],
    agentFormData: agentFormDataValue,
    setSelectedAgents: (agents: AgentProps[]) => set({ selectedAgents: agents }),
    getAgents: async () => {
        try {

            const { departmentID } = useDepartmentStore.getState()
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
    setTotalAgent: (total: TotalProps) => set({ totalAgent: total }),
    deleteAgentModal: false,
    openDeleteAgentModal: (agent: AgentProps) => set({ deleteAgentModal: true, agentData: agent }),
    closeDeleteAgentModal: () => set({ deleteAgentModal: false, agentData: null }),
    sendAgentPayslip: async (e: React.FormEvent) => {

        const { setIsLoading, setErr } = useGlobalStore.getState()

        try {
            e.preventDefault()
            setIsLoading(true);
            const { data } = await axios.post("/api/email/payslip/agent");
            if (data.ok) {
                setIsLoading(false)
                toast.success("Success! payslip has been sent to all agents.", { position: 'bottom-center' })
            }

        } catch (error: any) {
            setIsLoading(false);
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg);
            }
            alert("Something went wrong");
        }
    },

}))

export default useAdminAgentStore